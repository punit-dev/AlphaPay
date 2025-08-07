# AlphaPay - Simplifying Digital Payment

**AlphaPay** is a secure, modern, and easy-to-use payment application designed to simulate real-world digital transaction using a custom demo payment gateway. Built with a robust backend and a planned Kotlin(Jetpack Compose) Android frontend, AlphaPay supports OTP-based login, user management, payment flows, and transaction history.

> ⚙️ Backend: Node.js, Express.js, MongoDB<br>
> 📱 Frontend: Kotlin (Jetpack Compose - coming soon)

---

## 🚀 Features

AlphaPay is a secure and modern UPI-based payment system that includes a wide range of core functionalities. The backend currently supports the following features:

### ✅ Completed Backend Features

- **🔐 User Authentication**

  - Supports secure login and registration using email-based OTP verification.
  - JWT-based session management ensures secure access to protected routes.
  - Built-in checks for email verification before account creation.

- **📧 OTP System**

  - OTP is sent to the user’s email with expiration handling.
  - Secure verification flow with one-time usage logic.

- **🔒 Encrypted Sensitive Data**

  - Fields like password, phone number, UPI PIN, and DOB are encrypted using `mongoose-encryption` to maintain data privacy.

- **💳 Virtual UPI ID Management**

  - Generates unique virtual UPI ID upon registration.
  - UPI ID is used across the app for all transactions and user identification.

- **💸 Send Money**

  - Users can send money via virtual UPI ID or linked phone number.
  - Backend handles all transaction logic, including balance validation.

- **👤 Profile Management**

  - Update personal details like name, username, phone number, and date of birth.
  - Includes input validation and secure update flow.

- **📂 Transaction History**

  - Stores and fetches a complete list of user transactions.
  - Transactions are timestamped and categorized (sent/received).

- **💳 Pay via Debit/Credit Card**

  - Supports secure payment via linked card data (simulated for now).
  - Validates card details before processing payment.

- **💰 Wallet Management**
  - Users can view and manage their wallet balance.
  - Supports adding and performing transactions via wallet balance.

---

### 🔐 Security Highlights

- Mongoose encryption ensures sensitive fields are never stored in plaintext.
- All API responses are structured with appropriate status codes and validation error handling.
- Secure token handling for OTP, authentication, and session management.

---

## 🛠️ Tech Stack

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Backend    | Node.js, Express.js                    |
| Database   | MongoDB + Mongoose                     |
| Frontend   | Kotlin (Jetpack Compose)               |
| Auth & OTP | Custom Auth, JWT, OTP via Email        |
| Testing    | Jest, Supertest, MongoDB Memory Server |

---

## 📦 Installation for backend

1. Clone the repository:

   ```bash
   git clone https://github.com/punit-dev/AlphaPay.git
   cd AlphaPay/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:

     ```
     PORT=5000
     MONGO_URI=your_mongodb_uri

     JWT_SECRET=your_jwt_secret

     MY_EMAIL=your_email_service
     MY_EMAIL_PASS=your_email_username

     ENCRYPTION_KEY=your_encryption_key
     SIG_KEY=your_signature_key

     NODE_ENV=development
     ```

4. Start the development server:
   ```bash
   npm run start
   ```
5. Run tests:
   ```bash
   npm run test
   ```

---

## Frontend (Kotlin - In Progress)

The mobile app will include:

- QR Code and Scanner
- Bill payment interface
- Invoice viewer with QR verification
- Graphical transaction report

> 📌Android app will be built using **Jetpack Compose**

---

## 🗺️Roadmap

[x] Backend Core Logic
[x] OTP Auth System with Testing
[] QR Code Payment Support
[] Kotlin Android Frontend
[] Graph & Analytics
[] Deployment (Backend + APK)

---

## 📄License

This project is licensed under the [MIT License](LICENSE)
© 2025 Punit Poddar

---

> ⚠️ This project is developed and maintained by **Punit Poddar**.
