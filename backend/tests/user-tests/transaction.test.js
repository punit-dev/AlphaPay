require("@dotenvx/dotenvx").config({ path: ".env.test" });
const request = require("supertest");
const UserModel = require("../../src/models/user-models/userModel");
const TransactionModel = require("../../src/models/user-models/transactionModel");
const app = require("../../src/app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const BillModel = require("../../src/models/user-models/billModel");
const CardModel = require("../../src/models/user-models/cardModel");

let mongo;
const testUser = {
  username: "example123",
  fullname: "Example Test",
  password: "123456789",
  email: "domojeb184@ikanteri.com",
  phoneNumber: "9832713485",
  dateOfBirth: "2000-01-01",
  walletBalance: 1500,
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
  const res = await request(app).post("/api/users/auth/login").send({
    data: "example123",
    password: "123456789",
  });
  authToken = res.body.token;
  await request(app)
    .put("/api/users/update-pin")
    .send({ newPin: "123456" })
    .set({ authorization: `Bearer ${authToken}` });
});

afterAll(async () => {
  await UserModel.deleteMany();
  await TransactionModel.deleteMany();
  await BillModel.deleteMany();
  await CardModel.deleteMany();
  await mongoose.disconnect();
  await mongo.stop();
});

describe("transaction route testing", () => {
  it("should perform user to user transaction", async () => {
    await UserModel.create({
      username: "example456",
      fullname: "Testing user",
      password: "123456789",
      email: "domojeb114@ikanteri.com",
      phoneNumber: "9822713485",
      dateOfBirth: "2000-01-01",
    });

    const res = await request(app)
      .post("/api/users/transactions/user-to-user")
      .send({
        payee: "example456@alphapay",
        amount: 100,
        pin: "123456",
        method: "wallet",
        message: "this is testing message",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(201);

    const { initiatedBy, payee, amount, method, status } = res.body.transaction;
    expect(status).toBe("SUCCESS");
    expect(amount).toBe(100);
    expect(initiatedBy).toBe("USER");
    expect(payee.name).toBe("Testing user");
    expect(method.type).toBe("wallet");
  });
  it("should perform user to bill transaction", async () => {
    await BillModel.create({
      userId: (await UserModel.findOne({ username: "example123" }))._id,
      provider: "Test Provider",
      UIdType: "email",
      UId: "testbill@provider",
      category: "GooglePayTopUp",
      nickname: "My Google Pay",
    });

    const res = await request(app)
      .post("/api/users/transactions/user-to-bill")
      .send({
        id: "testbill@provider",
        method: "wallet",
        pin: "123456",
        amount: 100,
        validity: 28,
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(201);

    const { initiatedBy, payee, amount, method, status } = res.body.transaction;
    expect(status).toBe("SUCCESS");
    expect(amount).toBe(100);
    expect(initiatedBy).toBe("USER");
    expect(payee.name).toBe("Test Provider");
    expect(method.type).toBe("wallet");
  });
  it("should perform wallet top-up transaction", async () => {
    const card = await CardModel.create({
      userId: (await UserModel.findOne({ username: "example123" }))._id,
      cardNumber: "1234567890123456",
      cardHolder: "Example Test",
      expiryDate: "12/30",
      CVV: "123",
      type: "credit",
    });

    const res = await request(app)
      .post("/api/users/transactions/wallet-recharge")
      .send({
        cardID: card._id,
        amount: 500,
        upiPin: "123456",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(201);
    const { initiatedBy, amount, method, status } = res.body.transaction;
    expect(status).toBe("SUCCESS");
    expect(amount).toBe(500);
    expect(initiatedBy).toBe("USER");
    expect(method.type).toBe("card");
  });
  it("should perform to verify transactions", async () => {
    const transaction = await TransactionModel.create({
      initiatedBy: "USER",
      amount: 500,
      method: { type: "wallet" },
      status: "SUCCESS",
      category: "TOPUP",
      payer: {
        userRef: (await UserModel.findOne({ username: "example123" }))._id,
        name: "Example Test",
      },
      payee: { name: "Example Test", accountOrPhone: "example123@alphapay" },
    });

    const res = await request(app)
      .get(
        `/api/users/transactions/verify-transaction?query=${transaction._id}`
      )
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.transaction._id).toBe(transaction._id.toString());
    expect(res.body.transaction.amount).toBe(500);
    expect(res.body.transaction.status).toBe("SUCCESS");
    expect(res.body.transaction.method.type).toBe("wallet");
  });
  it("should get transaction history", async () => {
    await TransactionModel.create({
      initiatedBy: "USER",
      amount: 500,
      method: { type: "wallet" },
      status: "SUCCESS",
      category: "TOPUP",
      payer: {
        userRef: (await UserModel.findOne({ username: "example123" }))._id,
        name: "Example Test",
      },
      payee: { name: "Example Test", accountOrPhone: "example123@alphapay" },
    });
    const res = await request(app)
      .get("/api/users/transactions/all-transaction")
      .set({ authorization: `Bearer ${authToken}` });
    expect(res.statusCode).toBe(200);
    expect(res.body.allTransactions[0].amount).toBe(500);
    expect(res.body.allTransactions[0].status).toBe("SUCCESS");
    expect(res.body.allTransactions[0].method.type).toBe("wallet");
  });
});

describe("transaction route edge cases", () => {
  it("should fail user-to-user transaction with invalid payee", async () => {
    const res = await request(app)
      .post("/api/users/transactions/user-to-user")
      .send({
        payee: "nonexistent@alphapay",
        amount: 100,
        pin: "123456",
        method: "wallet",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Payee not found/i);
  });

  it("should fail user-to-user transaction with insufficient balance", async () => {
    // payee exists but sender doesn’t have enough balance
    await UserModel.create({
      username: "lowbalance",
      fullname: "Low Balance",
      password: "123456789",
      email: "lowbalance@demo.com",
      phoneNumber: "9812312312",
      dateOfBirth: "2000-01-01",
      walletBalance: 0,
    });

    const res = await request(app)
      .post("/api/users/transactions/user-to-user")
      .send({
        payee: "lowbalance@alphapay",
        amount: 2000,
        pin: "123456",
        method: "wallet",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Your wallet balance is too low./i);
  });

  it("should fail user-to-bill transaction with invalid bill ID", async () => {
    const res = await request(app)
      .post("/api/users/transactions/user-to-bill")
      .send({
        id: "wrong@provider",
        method: "wallet",
        pin: "123456",
        amount: 100,
        validity: 28,
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Bill not found/i);
  });

  it("should fail wallet recharge with invalid card", async () => {
    const res = await request(app)
      .post("/api/users/transactions/wallet-recharge")
      .send({
        cardID: "6123456789abcdef01234567", // random ObjectId
        amount: 500,
        upiPin: "123456",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Card not found/i);
  });

  it("should fail verify transaction with invalid ID", async () => {
    const res = await request(app)
      .get(
        `/api/users/transactions/verify-transaction?query=6123456789abcdef01234567`
      )
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/This transaction is not valid./i);
  });

  it("should return empty transaction history when no transactions exist", async () => {
    // clean up first
    await TransactionModel.deleteMany({});
    const res = await request(app)
      .get("/api/users/transactions/all-transaction")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.allTransactions).toHaveLength(0);
  });
});
