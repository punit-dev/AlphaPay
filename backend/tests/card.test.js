require("@dotenvx/dotenvx").config({ path: ".env.test" });
const request = require("supertest");
const CardModel = require("../src/models/cardModel");
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
  upiPin: "123456",
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
  await CardModel.deleteMany();
  await mongoose.disconnect();
  await mongo.stop();
});

describe("card route testing", () => {
  it("should add card", async () => {
    const res = await request(app)
      .post("/api/cards/registerCard")
      .send({
        cardNumber: 1234567890123456,
        CVV: 234,
        expiryDate: "12/25",
        cardHolder: "Example Test",
        type: "debit",
      })
      .set({
        authorization: `Bearer ${authToken}`,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch("New Card added successfully");
    const cardDetails = res.body.card;
    expect(cardDetails.cardNumber).toBe("1234567890123456");
    expect(cardDetails.CVV).toBe("234");
    expect(cardDetails.expiryDate).toMatch("12/25");
    expect(cardDetails.type).toMatch("debit");
  });
});
