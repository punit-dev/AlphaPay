require("@dotenvx/dotenvx").config({ path: ".env.test" });
const request = require("supertest");
const CardModel = require("../../src/models/user-models/cardModel");
const UserModel = require("../../src/models/user-models/userModel");
const app = require("../../src/app");
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
let cardID;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await UserModel.deleteMany();
  await UserModel.create(testUser);
  const res = await request(app).post("/api/clients/auth/login").send({
    data: "example123",
    password: "123456789",
  });

  authToken = res.body.token;
  await request(app)
    .put("/api/clients/users/update-pin")
    .send({ newPin: "123456" })
    .set({ authorization: `Bearer ${authToken}` });

  const resp = await request(app)
    .post("/api/clients/cards/register-card")
    .send({
      cardNumber: 1234567390128456,
      CVV: 244,
      expiryDate: "12/25",
      cardHolder: "Example Test",
      type: "debit",
    })
    .set({
      authorization: `Bearer ${authToken}`,
    });

  cardID = resp.body.card._id;
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
      .post("/api/clients/cards/register-card")
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

  it("should get all card", async () => {
    const res = await request(app)
      .get("/api/clients/cards/get-cards")
      .set({
        authorization: `Bearer ${authToken}`,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.cards[0].cardNumber).toBe("1234567390128456");
    expect(res.body.cards[0].CVV).toBe("244");
    expect(res.body.cards[0].expiryDate).toBe("12/25");
    expect(res.body.cards[0].type).toBe("debit");
  });

  it("should delete card", async () => {
    const res = await request(app)
      .delete(`/api/clients/cards/delete-card?query=${cardID}`)
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Card deleted successfully");
  });
});

describe("card route edge case testing", () => {
  //register card edge case
  it("should reject card registration with missing fields", async () => {
    const res = await request(app)
      .post("/api/clients/cards/register-card")
      .send({})
      .set({
        authorization: `Bearer ${authToken}`,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(
      "Card number must be exactly 16 digits, Card number must be numeric, CVV must be exactly 3 digits, CVV must be numeric, Expiry date is required, Expiry date must be in MM/YY format, Card holder name is too short, Card type must be either 'credit' or 'debit'"
    );
  });
  it("should reject card registration with incorrect format", async () => {
    const res = await request(app)
      .post("/api/clients/cards/register-card")
      .send({
        cardNumber: 12345789023456,
        CVV: "234",
        expiryDate: "25/12",
        cardHolder: "Example Test",
        type: "debit",
      })
      .set({
        authorization: `Bearer ${authToken}`,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(
      "Card number must be exactly 16 digits, Expiry date must be in MM/YY format"
    );
  });
  it("should reject card registration with expiryDate is expired", async () => {
    const res = await request(app)
      .post("/api/clients/cards/register-card")
      .send({
        cardNumber: 1234567890123456,
        CVV: 234,
        expiryDate: "12/22",
        cardHolder: "Example Test",
        type: "debit",
      })
      .set({
        authorization: `Bearer ${authToken}`,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("This card is expired");
  });
  it("should reject card registration with required authorization token", async () => {
    const res = await request(app)
      .post("/api/clients/cards/register-card")
      .send({
        cardNumber: 12345789023456,
        CVV: 234,
        expiryDate: "12/25",
        cardHolder: "Example Test",
        type: "debit",
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch("Token is required");
  });

  //get cards edge case
  it("should reject request with required authorization token", async () => {
    const res = await request(app).get("/api/clients/cards/get-cards");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token is required");
  });

  //delete card edge case
  it("should reject to delete card with missing field", async () => {
    const res = await request(app)
      .delete(`/api/clients/cards/delete-card`)
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Card ID query parameter is required");
  });
  it("should reject to delete card with required authorization token", async () => {
    const res = await request(app).delete(
      `/api/clients/cards/delete-card?query=${cardID}`
    );

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token is required");
  });
});
