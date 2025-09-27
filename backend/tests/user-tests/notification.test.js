require("@dotenvx/dotenvx").config({ path: ".env.test" });
const request = require("supertest");
const UserModel = require("../../src/models/user-models/userModel");
const app = require("../../src/app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const notificationModel = require("../../src/models/user-models/notificationModel");

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
  await mongoose.disconnect();
  await mongo.stop();
});

describe("notification route testing", () => {
  it("should fetch user notifications", async () => {
    await notificationModel.create({
      userId: (await UserModel.findOne({ username: "example123" }))._id,
      action: "credit",
      balance: 500,
      message: "You have received ₹500",
      type: "transaction",
    });
    const res = await request(app)
      .get("/api/users/notifications/get-notifications")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.notifications.length).toBeGreaterThan(0);
  });

  it("should read a notification", async () => {
    const notification = await notificationModel.create({
      userId: (await UserModel.findOne({ username: "example123" }))._id,
      action: "credit",
      balance: 500,
      message: "You have received ₹500",
      type: "transaction",
    });

    const res = await request(app)
      .put(
        `/api/users/notifications/mark-as-read?notificationId=${notification._id}`
      )
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.notification.isRead).toBe(true);
  });

  it("should delete a notification", async () => {
    const notification = await notificationModel.create({
      userId: (await UserModel.findOne({ username: "example123" }))._id,
      action: "credit",
      balance: 500,
      message: "You have received ₹500",
      type: "transaction",
    });

    const res = await request(app)
      .delete(
        `/api/users/notifications/delete-notification?notificationId=${notification._id}`
      )
      .set({ authorization: `Bearer ${authToken}` });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Notification deleted successfully/i);
  });
});

describe("notification route edge case testing", () => {
  it("should return empty array if no notifications exist", async () => {
    const res = await request(app)
      .get("/api/users/notifications/get-notifications")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.notifications).toEqual([]);
  });

  it("should fail if no auth token is provided for fetching notifications", async () => {
    const res = await request(app).get(
      "/api/users/notifications/get-notifications"
    );

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/unauthorized|token/i);
  });

  it("should return 404 if notificationId does not exist (mark as read)", async () => {
    const fakeId = "507f1f77bcf86cd799439011"; // valid ObjectId but not in DB
    const res = await request(app)
      .put(`/api/users/notifications/mark-as-read?notificationId=${fakeId}`)
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should return 400 if notificationId is invalid (mark as read)", async () => {
    const res = await request(app)
      .put("/api/users/notifications/mark-as-read?notificationId=invalidID")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Notification ID is required/i);
  });

  it("should return 404 when deleting a non-existent notification", async () => {
    const fakeId = "507f1f77bcf86cd799439012";
    const res = await request(app)
      .delete(
        `/api/users/notifications/delete-notification?notificationId=${fakeId}`
      )
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should return 400 if notificationId is invalid on delete", async () => {
    const res = await request(app)
      .delete(
        "/api/users/notifications/delete-notification?notificationId=wrongID"
      )
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Notification ID is required/i);
  });
});
