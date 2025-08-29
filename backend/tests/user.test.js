require("@dotenvx/dotenvx").config({ path: ".env.test" });
const request = require("supertest");
const UserModel = require("../src/models/userModel");
const app = require("../src/app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;
const testUser = {
  username: "example123",
  fullname: "Example Test",
  password: "123456789",
  email: "domojeb184@ikanteri.com",
  phoneNumber: "9832713485",
  dateOfBirth: "2000-01-01",
};
let authToken;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await UserModel.deleteMany();
  await UserModel.create(testUser);
  const res = await request(app).post("/api/auth/login").send({
    data: "example123",
    password: "123456789",
  });

  authToken = res.body.token;
});

afterAll(async () => {
  await UserModel.deleteMany();
  await mongoose.disconnect();
  await mongo.stop();
});

describe("user route testing", () => {
  it("should read user data", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    const { username, email, phoneNumber, fullname, dateOfBirth } =
      res.body.user;

    expect(username).toBe("example123");
    expect(email).toBe("domojeb184@ikanteri.com");
    expect(phoneNumber).toBe("9832713485");
    expect(fullname).toBe("Example Test");
    expect(new Date(dateOfBirth)).toEqual(new Date("2000-01-01"));
  });

  it("should update user data", async () => {
    const res = await request(app)
      .put("/api/users/update")
      .send({
        username: "testing123",
        fullname: "Testing User",
        phoneNumber: "9742734567",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);

    const { username, fullname, phoneNumber } = res.body.user;

    expect(username).toBe("testing123");
    expect(fullname).toBe("Testing User");
    expect(phoneNumber).toBe("9742734567");
  });

  it("should update user login password", async () => {
    const res = await request(app)
      .put("/api/users/update-pass")
      .send({
        newPass: "7746231005",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password is successfully updated");
  });

  it("should update user UPI Pin", async () => {
    const res = await request(app)
      .put("/api/users/update-pin")
      .send({
        newPin: "774623",
      })
      .set({ authorization: `Bearer ${authToken}` });
    console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("UPI Pin is successfully updated");
  });

  it("should delete user account", async () => {
    const res = await request(app)
      .delete("/api/users/delete")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User Deleted Successfully");
  });

  it("should delete user account", async () => {
    const res = await request(app)
      .get("/api/users/search")
      .query({ query: "exam" })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    const users = res.body.users;

    expect(users[0].username).toBe("example123");
    expect(users[0].fullname).toBe("Example Test");
    expect(users[0].email).toBe("domojeb184@ikanteri.com");
    expect(users[0].phoneNumber).toBe("9832713485");
  });
});

describe("user route edge cases testing", () => {
  //user profile edge case
  it("should return 401 when no token is provided", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.statusCode).toBe(401);
  });

  //update user edge case
  it("should message 'Must be a valid email' when invalid email is provided", async () => {
    const res = await request(app)
      .put("/api/users/update")
      .send({ email: "invalid-email" })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Must be a valid email");
  });

  //update password edge case
  it("should return 400 if newPass is not provided", async () => {
    const res = await request(app)
      .put("/api/users/update-pass")
      .send({})
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "New password is required, Password must be at least 6 characters"
    );
  });

  it("should return 400 if newPass is same as old password", async () => {
    const res = await request(app)
      .put("/api/users/update-pass")
      .send({ newPass: "123456789" })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("This password is already set.");
  });

  //update UPI pin edge case
  it("should return 400 if newPin is not provided", async () => {
    const res = await request(app)
      .put("/api/users/update-pin")
      .send({})
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "New UPI Pin is required, UPI Pin must be 4 to 6 digits"
    );
  });

  //search users edge case
  it("should return 400 if query param is missing", async () => {
    const res = await request(app)
      .get("/api/users/search")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Search query is required, Search must be a valid string"
    );
  });

  it("should return 404 if no user found", async () => {
    const res = await request(app)
      .get("/api/users/search")
      .query({ query: "no-match-found" })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
});
