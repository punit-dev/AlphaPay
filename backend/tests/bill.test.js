require("@dotenvx/dotenvx").config({ path: ".env.test" });
const request = require("supertest");
const BillModel = require("../src/models/billModel");
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

const testBill = {
  provider: "Jio",
  UIdType: "mobileNumber",
  UId: "1234567890",
  category: "MobileRecharge",
  nickname: "testing",
};

let authToken;
let billID;

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
  const resp = await request(app)
    .post("/api/bills/registerBill")
    .send(testBill)
    .set({
      authorization: `Bearer ${authToken}`,
    });

  billID = resp.body.bill._id;
});

afterAll(async () => {
  await UserModel.deleteMany();
  await BillModel.deleteMany();
  await mongoose.disconnect();
  await mongo.stop();
});

describe("bill route testing", () => {
  it("should register a bill", async () => {
    const res = await request(app)
      .post("/api/bills/registerBill")
      .send({ ...testBill, UId: "1234567809" })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(201);
    const bill = res.body.bill;
    expect(bill.provider).toBe("Jio");
    expect(bill.UIdType).toBe("mobileNumber");
    expect(bill.UId).toBe("1234567809");
    expect(bill.category).toBe("MobileRecharge");
    expect(bill.nickname).toBe("testing");
  });
  it("should get user bills", async () => {
    const res = await request(app)
      .get("/api/bills/getBills")
      .set({ authorization: `Bearer ${authToken}` });
    expect(res.statusCode).toBe(200);
    const bills = res.body.bills;
    expect(bills[0].UId).toBe("1234567890");
  });
  it("should update user bill", async () => {
    const res = await request(app)
      .put(`/api/bills/updateBill?query=${testBill.UId}`)
      .send({
        provider: "VI",
        UId: "8943748522",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    const bill = res.body.updatedBill;
    expect(bill.provider).toBe("VI");
    expect(bill.UId).toBe("8943748522");
  });
  it("should delete user bill", async () => {
    const res = await request(app)
      .delete(`/api/bills/deleteBill?query=${testBill.UId}`)
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Bill deleted Successfully");
    expect(res.body.billID).toBe(billID);
  });
});

describe("bill route edge case testing", () => {
  //register bill edge case
  it("should reject bill registration with missing fields", async () => {
    const res = await request(app)
      .post("/api/bills/registerBill")
      .send({})
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(
      "Provider is required, UIdType is required, UId is required, Category is required"
    );
  });
  it("should reject bill registration with required authorization token", async () => {
    const res = await request(app)
      .post("/api/bills/registerBill")
      .send({ ...testBill, UId: "1234567809" });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch("Token is required");
  });

  //get bill edge case
  it("should reject request with required authorization token", async () => {
    const res = await request(app).get("/api/bills/getBills");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token is required");
  });

  //update bill edge case
  it("should reject update user bill with required UId query", async () => {
    const res = await request(app)
      .put(`/api/bills/updateBill?query=`)
      .send({
        provider: "VI",
        UId: "8943748522",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Bill UId query is required");
  });
  it("should reject update user bill with required authorization token", async () => {
    const res = await request(app)
      .put(`/api/bills/updateBill?query=${testBill.UId}`)
      .send({
        provider: "VI",
        UId: "8943748522",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch("Token is required");
  });

  //delete bill edge case
  it("should reject to delete bill with missing field", async () => {
    const res = await request(app)
      .delete(`/api/bills/deleteBill?query=`)
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Bill UId query is required");
  });
  it("should reject to delete card with required authorization token", async () => {
    const res = await request(app).delete(
      `/api/bills/deleteBill?query=${testBill.UId}`
    );

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token is required");
  });
});
