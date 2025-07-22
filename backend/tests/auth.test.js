require("@dotenvx/dotenvx").config({ path: ".env.test" });
const request = require("supertest");
const UserModel = require("../src/models/userModel");
const app = require("../src/app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await UserModel.deleteMany();
  await mongoose.disconnect();
  await mongo.stop();
});

const testUser = {
  username: "example123",
  fullname: "Example Test",
  password: "123456789",
  email: "rafeg23079@modirosa.com",
  phoneNumber: "9832713485",
  upiPin: "123456",
  dateOfBirth: "2000-01-01",
};

let authToken;
let otp;

describe("auth route testing", () => {
  it("should user register", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toBe(201);
    otp = res.body.otp;
    const user = await UserModel.findOne({
      email: "rafeg23079@modirosa.com",
    });

    expect(user).toBeTruthy();

    expect(user.username).toBe("example123");
    expect(user.upiId).toBe("example123@alphapay");
    expect(user.phoneNumber).toBe("9832713485");
    expect(user.dateOfBirth).toEqual(new Date("2000-01-01"));
  });

  it("should otp verify", async () => {
    const res = await request(app)
      .post("/api/auth/verifyOtp")
      .send({ otp: otp, email: "rafeg23079@modirosa.com" });

    expect(res.statusCode).toBe(200);
  });

  it("should user login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      data: "example123",
      password: "123456789",
    });

    const body = JSON.parse(res.text);
    expect(res.statusCode).toBe(200);

    authToken = body.token;
  });

  it("should logout user", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch("Log out successfully");
  });
});

describe("auth route edge cases testing", () => {
  //verifyOtp edge case
  it("should not verify OTP without otp and token", async () => {
    const res = await request(app).post("/api/auth/verifyOtp").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(
      "OTP is required, OTP must be valid, Valid email is required"
    );
  });
  it("should not verify with invalid OTP format", async () => {
    const res = await request(app)
      .post("/api/auth/verifyOtp")
      .send({ otp: "abc123", email: "fakeEmail" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Valid email is required");
  });

  //register user edge case
  it("should reject registration with missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "",
      email: "",
      password: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(
      `Username is required, Username must be at least 5 characters, Fullname is required, Valid email is required, Valid phone number is required, Password must be at least 6 characters, UPI Pin must be 4-6 digits, Valid date of birth is required`
    );
  });
  it("should reject registration with invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        ...testUser,
        email: "Invalid Email",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Valid email is required");
  });
  it("should reject if password too short", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        ...testUser,
        password: "123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Password must be at least 6 characters");
  });
  it("should reject registration if username or email already exists", async () => {
    // First create user
    await request(app).post("/api/auth/register").send(testUser);

    // Try again with same email
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("User already exist");
  });

  //login edge case
  it("should reject login with missing fields", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(
      "Email or username is required, Password is required"
    );
  });
  it("should reject login with wrong credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      data: "wrongUser",
      password: "wrongPass",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch("Incorrect username and password");
  });
  it("should reject NoSQL injection attempt", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        data: { $gt: "" },
        password: "any",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Incorrect username and password");
  });

  //logout edge case
  it("should reject logout without token", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch("Token is required");
  });
  it("should reject logout with invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", "Bearer fake.token.here");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch("Token invalid.");
  });
});
