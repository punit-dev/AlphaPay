# AlphaPay API Documentation

This document provides a comprehensive guide to the RESTful APIs available in the AlphaPay backend. It includes details about each endpoint, request and response formats, authentication methods, and error handling.

## Base URLs

**_Base URL for Users in local environment_**: http://localhost:3000/api/users<br>
**_Base URL for Admins in local environment_**: http://localhost:3000/api/admin

## Index

- [Users APIs](#users-apis)
  - [Auth APIs](#auth-apis)
  - [User Profile Management APIs](#user-profile-management-apis)
  - [User Card Management APIs](#user-card-management-apis)
  - [User Bill Management APIs](#user-bill-management-apis)
  - [Transactions APIs](#transactions-apis)
  - [Notification APIs](#notification-apis)
- [Admin APIs](#admin-apis)
  - [Admin Auth APIs](#admin-auth-apis)
  - [Admin Profile Management APIs](#admin-profile-management-apis)
  - [Dashboard APIs](#dashboard-apis)
  - [User Management APIs](#user-management-apis)
  - [Transaction Management APIs](#transaction-management-apis)

## Users APIs

### Auth APIs

#### Register an user

**Endpoint:** `POST /auth`  
**Access:** Public<br>
**Description:** Register a new user.

##### Body Request

| Field         | Type   | Required | Description                        |
| ------------- | ------ | -------- | ---------------------------------- |
| `username`    | String | Yes      | Unique username for the user.      |
| `fullname`    | String | Yes      | Full name of the user.             |
| `email`       | String | Yes      | Email address of the user.         |
| `dateOfBirth` | String | Yes      | Date of birth (YYYY-MM-DD format). |
| `phoneNumber` | String | Yes      | Phone number of the user.          |
| `password`    | String | Yes      | Password for the user account.     |

- Success Response:
  status: `201 Created`
  ```json
  {
    "message": "User created successfully",
    "user": "newUser_data_object",
    "authToken": "authToken",
    "otp": "verification_otp_if_in_test_mode"
  }
  ```
- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "User already exists"
    }
    ```

#### Verify OTP

**Endpoint:** `POST /auth/verify-otp`  
**Access:** Public<br>
**Description:** Verify the OTP sent to the user's email.

##### Body Request

| Field   | Type   | Required | Description                       |
| ------- | ------ | -------- | --------------------------------- |
| `email` | String | Yes      | Email address of the user.        |
| `otp`   | String | Yes      | OTP received on the user's email. |

- Success Response:
  - status: `200 OK`
  ```json
  {
    "message": "OTP Successfully verified"
  }
  ```
- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "OTP expired or invalid. Please request a new one."
    }
    ```

#### Resend OTP

**Endpoint:** `POST /auth/resend-otp`  
**Access:** Public<br>
**Description:** Resend the OTP to the user's email.

##### Body Request

| Field   | Type   | Required | Description                |
| ------- | ------ | -------- | -------------------------- |
| `email` | String | Yes      | Email address of the user. |

- Success Response:

  - status: `200 OK`

  ```json
  {
    "message": "OTP sent successfully",
    "otp": "verification_otp_if_in_test_mode"
  }
  ```

- Error Responses:

  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```

#### Login User

**Endpoint:** `POST /auth/login`  
**Access:** Public<br>
**Description:** Login an existing user.

##### Body Request

| Field              | Type   | Required | Description                            |
| ------------------ | ------ | -------- | -------------------------------------- |
| `username`/`email` | String | Yes      | Unique username or email for the user. |
| `password`         | String | Yes      | Password for the user account.         |

- Success Response:

  - status: `200 OK`

  ```json
  {
    "message": "User logged in successfully",
    "token": "user_auth_token",
    "user": "user_data_object"
  }
  ```

- Error Responses:

  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Incorrect username and password"
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Your account is blocked."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Please verify your email to login."
    }
    ```

#### Logout User

**Endpoint:** `POST /auth/logout`  
**Access:** Private<br>
**Description:** Logout the user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:
  - status: `200 OK`
  ```json
  {
    "message": "Logout successfully"
  }
  ```
- Error Responses:
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```

### User Profile Management APIs

#### Get User Profile

**Endpoint:** `GET /profile`  
**Access:** Private<br>
**Description:** Get the user profile details.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:
  - status: `200 OK`
  ```json
  {
    "message": "User Profile Details",
    "user": "user_data_object"
  }
  ```
- Error Responses:

  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```

#### Update User Details

**Endpoint:** `PUT /update`  
**Access:** Private<br>
**Description:** Update user details.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field         | Type   | Required | Description                        |
| ------------- | ------ | -------- | ---------------------------------- |
| `username`    | String | No       | Unique username for the user.      |
| `fullname`    | String | No       | Full name of the user.             |
| `email`       | String | No       | Email address of the user.         |
| `dateOfBirth` | String | No       | Date of birth (YYYY-MM-DD format). |
| `phoneNumber` | String | No       | Phone number of the user.          |

- Success Response:

  - status: `200 OK`

    ```json
    {
      "message": "User Updated",
      "user": "updated_user_data_updated"
    }
    ```

- Error Responses:

  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Username already in use."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "email already in use."
    }
    ```

#### Update User Login Password

**Endpoint:** `PUT /update-pass`  
**Access:** Private<br>
**Description:** Update user login password.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field     | Type   | Required | Description                |
| --------- | ------ | -------- | -------------------------- |
| `newPass` | String | Yes      | New password for the user. |

- Success Response:

  - status: `200 OK`

    ```json
    { "message": "Password is successfully updated" }
    ```

- Error Responses:

  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "New password must be different from the old password."
    }
    ```

#### Update User UPI Pin

**Endpoint:** `PUT /update-pin`  
**Access:** Private<br>
**Description:** Update user UPI pin.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field    | Type   | Required | Description               |
| -------- | ------ | -------- | ------------------------- |
| `newPin` | String | Yes      | New UPI pin for the user. |

- Success Response:

  - status: `200 OK`

    ```json
    { "message": "UPI Pin is successfully updated" }
    ```

- Error Responses:

  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "New UPI pin must be different from the old pin."
    }
    ```

#### Delete User Account

**Endpoint:** `DELETE /delete`  
**Access:** Private<br>
**Description:** Delete user account.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:
  - status: `200 OK`
  ```json
  { "message": "User Deleted Successfully" }
  ```
- Error Responses:
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```

#### Search Users

**Endpoint:** ` GET /search?query=`  
**Access:** Private<br>
**Description:** Search users by upi id or phone number.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Parameters

| Field   | Type   | Required | Description                           |
| ------- | ------ | -------- | ------------------------------------- |
| `query` | String | Yes      | Search term (upi id or phone number). |

- Success Response:
  - status: `200 OK`
  ```json
  {
    "message": "Search Results",
    "results": ["array_of_matching_user_objects"]
  }
  ```
- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```

### User Card Management APIs

#### Add New Card

**Endpoint:** `POST /cards/register-card`
**Access:** Private<br>
**Description:** Add a new card for the user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field        | Type   | Required | Description              |
| ------------ | ------ | -------- | ------------------------ |
| `cardNumber` | String | Yes      | Card number              |
| `cardHolder` | String | Yes      | Card holder name         |
| `expiryDate` | String | Yes      | Expiry date (MM/YY)      |
| `cvv`        | String | Yes      | Card CVV                 |
| `type`       | String | Yes      | Card type (debit/credit) |

- Success Response:

  - status: `201 Created`

    ```json
    {
      "message": "New Card added successfully",
      "card": "new_card_data_object"
    }
    ```

- Error Responses:

  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "This card is expired"
    }
    ```

#### Get All Cards

**Endpoint:** `GET /cards/get-cards`
**Access:** Private<br>
**Description:** Get all cards of the logged-in user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:
  - status: `200 OK`
    ```json
    {
      "message": "All cards",
      "cards": ["array_of_user_card_objects"]
    }
    ```
- Error Responses:
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Cards not available."
    }
    ```

#### Delete a Card

**Endpoint:** `DELETE /cards/delete-card`
**Access:** Private<br>
**Description:** Delete a specific card of the logged-in user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Request

| Field   | Type   | Required | Description               |
| ------- | ------ | -------- | ------------------------- |
| `query` | String | Yes      | ID of the card to delete. |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Card deleted successfully",
      "cardId": "deleted_card_id"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Card not found"
    }
    ```

### User Bill Management APIs

#### Add a New Bill

**Endpoint:** `POST /bills/register-bill`
**Access:** Private<br>
**Description:** Add a new bill for the user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field      | Type   | Required | Description                |
| ---------- | ------ | -------- | -------------------------- |
| `provider` | String | Yes      | Bill provider name         |
| `UIdType`  | String | Yes      | User ID type (email/phone) |
| `UId`      | String | Yes      | User ID (email or phone)   |
| `category` | String | Yes      | Bill category              |
| `nickname` | String | No       | Nickname for the bill      |

- Success Response:

  - status: `201 Created`

    ```json
    {
      "message": "Bill registered successfully",
      "bill": "new_bill_data_object"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `400 Not Found`
    ```json
    {
      "message": "This Bill already exists."
    }
    ```

#### Get All Bills

**Endpoint:** `GET /bills/get-bills`
**Access:** Private<br>
**Description:** Get all bills of the logged-in user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "All Bills",
      "bills": ["array_of_user_bill_objects"]
    }
    ```

- Error Responses:
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Bills not available."
    }
    ```

#### Update a Bill

**Endpoint:** `PUT /bills/update-bill`
**Access:** Private<br>
**Description:** Update a specific bill of the logged-in user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Request

| Field   | Type   | Required | Description               |
| ------- | ------ | -------- | ------------------------- |
| `query` | String | Yes      | ID of the bill to update. |

##### Body Request

| Field      | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| `provider` | String | No       | Bill provider name       |
| `UId`      | String | No       | User ID (email or phone) |
| `nickname` | String | No       | Nickname for the bill    |

- Success Response:

  - status: `200 OK`

    ```json
    {
      "message": "Bill updated successfully",
      "updatedBill": "updated_bill_data_object"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Bill not found."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "This Bill already exists."
    }
    ```

#### Delete a Bill

**Endpoint:** `DELETE /bills/delete-bill`
**Access:** Private<br>
**Description:** Delete a specific bill of the logged-in user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Request

| Field   | Type   | Required | Description               |
| ------- | ------ | -------- | ------------------------- |
| `query` | String | Yes      | ID of the bill to delete. |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Bill deleted successfully",
      "billId": "deleted_bill_id"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Bill not found."
    }
    ```

### Transactions APIs

#### User to User Transfer

**Endpoint:** `POST /transactions/user-to-user`
**Access:** Private<br>
**Description:** Transfer money from one user to another

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field     | Type   | Required    | Description                                                    |
| --------- | ------ | ----------- | -------------------------------------------------------------- |
| `Payee`   | String | Yes         | UPI ID of the Payee                                            |
| `amount`  | Number | Yes         | Amount to transfer                                             |
| `Pin`     | String | Yes         | UPI Pin for authentication                                     |
| `method`  | String | Yes         | Payment method (card/wallet)                                   |
| `message` | String | No          | Optional message for the payee                                 |
| `cardId`  | String | Conditional | Required if method is card. ID of the card to use for payment. |

- Success Response:

  - status: `201 Created`
    ```json
    {
      "message": "Transaction successfully completed.",
      "transaction": "transaction_data_object"
    }
    ```

- Error Responses:

  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Payee not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Amount must be greater than zero."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Your wallet balance is too low."
    }
    ```
  - status: `400 Bad Request`

    ```json
    {
      "message": "Card ID is required for card payments."
    }
    ```

  - status: `404 Not Found`
    ```json
    {
      "message": "Card not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Transaction failed. Please check details and try again."
    }
    ```

#### User to Bill Payment

**Endpoint:** `POST /transactions/user-to-bill`
**Access:** Private<br>
**Description:** Pay a bill using wallet or card

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field      | Type   | Required    | Description                                                    |
| ---------- | ------ | ----------- | -------------------------------------------------------------- |
| `id`       | String | Yes         | ID of the bill to pay                                          |
| `method`   | String | Yes         | Payment method (card/wallet)                                   |
| `pin`      | String | Yes         | UPI Pin for authentication                                     |
| `cardID`   | String | Conditional | Required if method is card. ID of the card to use for payment. |
| `amount`   | Number | Yes         | Amount to pay                                                  |
| `validity` | String | Yes         | Validity of the payment method (if applicable)                 |

- Success Response:

  - status: `201 Created`
    ```json
    {
      "message": "Bill paid successfully",
      "transaction": "transaction_data_object"
    }
    ```

- Error Responses:

  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Bill not found."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Amount must be greater than zero."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Your wallet balance is too low."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Card ID is required for card payments."
    }
    ```
  - status: `404 Not Found`

    ```json
    {
      "message": "Card not found"
    }
    ```

  - status: `400 Bad Request`
    ```json
    {
      "message": "Transaction failed. Please check details and try again."
    }
    ```

#### Wallet Recharge

**Endpoint:** `POST /transactions/wallet-recharge`
**Access:** Private<br>
**Description:** Recharge wallet using card

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field    | Type   | Required | Description                 |
| -------- | ------ | -------- | --------------------------- |
| `cardId` | String | Yes      | ID of the card to use.      |
| `amount` | Number | Yes      | Amount to recharge.         |
| `upiPin` | String | Yes      | UPI Pin for authentication. |

- Success Response:

  - status: `201 Created`
    ```json
    {
      "message": "Money successfully added to your wallet.",
      "newBalance": "updated_wallet_balance"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Amount must be greater than 0."
    }
    ```
    - status: `404 Not Found`
    ```json
    {
      "message": "Card not found"
    }
    ```
    - status: `400 Bad Request`
    ```json
    {
      "message": "Transaction failed. Please check details and try again."
    }
    ```

#### Verify Transaction

**Endpoint:** `GET /transactions/verify-transaction?query=transactionId`
**Access:** Private<br>
**Description:** Verify the status of a transaction using its ID.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Parameters

| Field   | Type   | Required | Description                      |
| ------- | ------ | -------- | -------------------------------- |
| `query` | String | Yes      | ID of the transaction to verify. |

- Success Response:
  - status: `200 OK`
    ```json
    {
      "message": "This transaction is verified.",
      "transaction": "transaction_data_object"
    }
    ```
- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "This transaction is not valid."
    }
    ```

#### Get All Transactions

**Endpoint:** `GET /transactions/get-transactions`
**Access:** Private<br>
**Description:** Get all transactions of the logged-in user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Transaction History",
      "allTransactions": ["array_of_user_transaction_objects"]
    }
    ```

- Error Responses:
  - status: `404 Not Found`
    ```json
    {
      "message": "Transaction not found"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```

### Notification APIs

#### Get All Notifications

**Endpoint:** `GET /notifications/get-notifications`
**Access:** Private<br>
**Description:** Get all notifications of the logged-in user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:
  - status: `200 OK`
    ```json
    {
      "message": "Notifications",
      "notifications": ["array_of_user_notification_objects"]
    }
    ```
- Error Responses:
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Notifications not found"
    }
    ```

#### Mark Notification as Read

**Endpoint:** `PUT /notifications/mark-as-read?notificationId=<notificationId>`
**Access:** Private<br>
**Description:** Mark a specific notification as read.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Request

| Field            | Type   | Required | Description                             |
| ---------------- | ------ | -------- | --------------------------------------- |
| `notificationId` | String | Yes      | ID of the notification to mark as read. |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Notification marked as read",
      "notification": "updated_notification_data_object"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Notification not found"
    }
    ```

#### Delete Notification

**Endpoint:** `DELETE /notifications/delete-notification?notificationId=<notificationId>`
**Access:** Private<br>
**Description:** Delete a specific notification.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Request

| Field            | Type   | Required | Description                       |
| ---------------- | ------ | -------- | --------------------------------- |
| `notificationId` | String | Yes      | ID of the notification to delete. |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Notification deleted successfully",
      "notification": "deleted_notification_data_object"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Notification not found"
    }
    ```

## Admin APIs

### Admin Auth APIs

#### Admin Register

**Endpoint:** `POST /auth/register`  
**Access:** Super Admin<br>
**Description:** Register a new admin user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field      | Type   | Required | Description                                |
| ---------- | ------ | -------- | ------------------------------------------ |
| `fullname` | String | Yes      | Full nama of the admin user.               |
| `email`    | String | Yes      | Unique email address of the admin user.    |
| `password` | String | Yes      | Password for the admin user account.       |
| `role`     | String | Yes      | Role of the admin user (admin/superAdmin). |

- Success Response:

  - status: `201 Created`

    ```json
    {
      "message": "Admin registered successfully",
      "admin": "new_admin_user_data_object"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token is required."
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Email already in use."
    }
    ```

#### Admin Login

**Endpoint:** `POST /auth/login`
**Access:** Public<br>
**Description:** Login for admin users.

##### Body Request

| Field      | Type   | Required | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| `email`    | String | Yes      | Email address of the admin user.     |
| `password` | String | Yes      | Password for the admin user account. |

- Success Response:
  - status: `200 OK`
  ```json
  {
    "message": "Login successfully",
    "admin": {
      "id": "<admin_id>",
      "fullname": "<admin_fullname>",
      "email": "<admin_email>",
      "role": "<admin_role>"
    }
  }
  ```
- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Bad Request`
    ```json
    {
      "message": "Incorrect email and password"
    }
    ```

#### Admin Logout

**Endpoint:** `POST /auth/logout`  
**Access:** Private<br>
**Description:** Logout the admin user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:
  - status: `200 OK`
  ```json
  {
    "message": "Logout successfully"
  }
  ```
- Error Responses:
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

### Admin Profile Management APIs

#### Get Admin Users List

**Endpoint:** `GET /`  
**Access:** Super Admin<br>
**Description:** Get a list of admin users with optional filters.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Parameters

| Field        | Type   | Required | Description                              |
| ------------ | ------ | -------- | ---------------------------------------- |
| `page`       | Number | No       | Page number for pagination (default: 1). |
| `limit`      | Number | No       | Number of users per page (default: 10).  |
| `email`      | String | No       | Filter by admin email address.           |
| `searchTerm` | String | No       | Search term for admin fullname or email. |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Admin Users List",
      "admins": ["array_of_admin_user_objects"],
      "pagination": {
        "total": "total_number_of_admins",
        "page": "current_page_number",
        "pages": "total_number_of_pages",
        "next": "next_page_number_or_null",
        "prev": "previous_page_number_or_null"
      }
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

#### Admin Profile

**Endpoint:** `GET /profile`
**Access:** Private<br>
**Description:** Get the profile of the logged-in admin user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:
  - status: `200 OK`
  ```json
  {
    "message": "Admin Profile",
    "admin": "admin_user_data_object"
  }
  ```
- Error Responses:
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

#### Update Admin Role

**Endpoint:** `PUT /update-role`  
**Access:** Super Admin<br>
**Description:** Update the role of an admin user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field     | Type   | Required | Description                     |
| --------- | ------ | -------- | ------------------------------- |
| `role`    | String | Yes      | New role for the admin user.    |
| `adminId` | String | Yes      | ID of the admin user to update. |

- Success Response:

  - status: `200 OK`

    ```json
    {
      "message": "Admin role updated successfully",
      "admin": "updated_admin_user_data_object"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Cannot change your own role."
    }
    ```

#### Update Admin Password

**Endpoint:** `PUT /update-password`  
**Access:** Private<br>
**Description:** Update the password of the logged-in admin user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field        | Type   | Required | Description                         |
| ------------ | ------ | -------- | ----------------------------------- |
| `currentPwd` | String | Yes      | Current password of the admin user. |
| `newPwd`     | String | Yes      | New password for the admin user.    |

- Success Response:

  - status: `200 OK`

    ```json
    {
      "message": "Password updated successfully"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Current password is incorrect."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "New password must be different from the current password."
    }
    ```

#### Delete Admin User

**Endpoint:** `DELETE /delete?adminId=<adminId>`  
**Access:** Super Admin<br>
**Description:** Delete a specific admin user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Request

| Field     | Type   | Required | Description                     |
| --------- | ------ | -------- | ------------------------------- |
| `adminId` | String | Yes      | ID of the admin user to delete. |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Admin user deleted successfully",
      "admin": "deleted_admin_user_data_object"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Cannot delete your own account."
    }
    ```

### Dashboard APIs

#### Get Dashboard Statistics

**Endpoint:** `GET /dashboard`
**Access:** Private<br>
**Description:** Get key statistics for the admin dashboard.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

- Success Response:
  - status: `200 OK`
    ```json
    {
      "message": "Dashboard Statistics",
      "statistics": {
        "totalUsers": "total_number_of_users",
        "activeUsers": "number_of_active_users",
        "totalTransactions": "number_of_transactions",
        "successTransactions": "number_of_successful_transactions",
        "failedTransactions": "number_of_failed_transactions",
        "refundTransactions": "number_of_refunded_transactions",
        "deductionTransaction": "number_of_deduction_transactions",
        "totalRevenue": "total_revenue_generated",
        "avgTransactionValue": "average_transaction_value",
        "transactionSuccessRatio": "transaction_success_ratio",
        "topUsers": "top_users_data"
      }
    }
    ```
- Error Responses:
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

### User Management APIs

#### Get All Users

**Endpoint:** `GET /users`
**Access:** Admin, SuperAdmin<br>
**Description:** Get a list of all users with optional filters.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Parameters

| Field        | Type    | Required | Description                                               |
| ------------ | ------- | -------- | --------------------------------------------------------- |
| `blocked`    | Boolean | No       | Filter users by blocked status.                           |
| `gtWallet`   | Number  | No       | Filter users with wallet balance greater than this value. |
| `ltWallet`   | Number  | No       | Filter users with wallet balance less than this value.    |
| `lastActive` | Number  | No       | Filter users by last active days.                         |
| `limit`      | Number  | No       | Number of users to return (default: 50).                  |
| `page`       | Number  | No       | Page number for pagination (default: 1).                  |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Users List",
      "users": ["array_of_user_objects"],
      "pagination": {
        "total": "total_number_of_users",
        "page": "current_page_number",
        "pages": "total_number_of_pages",
        "next": "next_page_number_or_null",
        "prev": "previous_page_number_or_null"
      }
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

#### Get User by ID with transactions

**Endpoint:** `GET /users/transactions`
**Access:** Admin, SuperAdmin<br>
**Description:** Get a user by ID along with their transactions, with optional filters.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Parameters

| Field    | Type   | Required | Description                                               |
| -------- | ------ | -------- | --------------------------------------------------------- |
| `userId` | String | Yes      | ID of the user to retrieve transactions for.              |
| `limit`  | Number | No       | Number of transactions to return (default: 50).           |
| `status` | String | No       | Filter transactions by status (e.g., pending, completed). |
| `method` | String | No       | Filter transactions by payment method (e.g., card, bank). |
| `gta`    | Number | No       | Filter transactions with amount greater than this value.  |
| `lta`    | Number | No       | Filter transactions with amount less than this value.     |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "User transactions",
      "user": "user_object",
      "transactions": ["array_of_transaction_objects"],
      "txnsPagination": {
        "total": "total_number_of_transactions",
        "page": "current_page_number",
        "pages": "total_number_of_pages",
        "next": "next_page_number_or_null",
        "prev": "previous_page_number_or_null"
      }
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

#### Block User

**Endpoint:** `PUT /users/block`
**Access:** Admin, SuperAdmin<br>
**Description:** Block a specific user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Parameters

| Field    | Type   | Required | Description              |
| -------- | ------ | -------- | ------------------------ |
| `userId` | String | Yes      | ID of the user to block. |

- Success Response:
  - status: `200 OK`
    ```json
    {
      "message": "User blocked Successfully",
      "user": "updated_user_data_object"
    }
    ```
- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

#### Unblock User

**Endpoint:** `PUT /users/unblock`
**Access:** Admin, SuperAdmin<br>
**Description:** Unblock a specific user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Parameters

| Field    | Type   | Required | Description              |
| -------- | ------ | -------- | ------------------------ |
| `userId` | String | Yes      | ID of the user to block. |

- Success Response:
  - status: `200 OK`
    ```json
    {
      "message": "User unblocked Successfully",
      "user": "updated_user_data_object"
    }
    ```
- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

#### Delete User

**Endpoint:** `DELETE /users/delete`
**Access:** Admin, SuperAdmin<br>
**Description:** Delete a specific user.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Parameters

| Field    | Type   | Required | Description               |
| -------- | ------ | -------- | ------------------------- |
| `userId` | String | Yes      | ID of the user to delete. |

- Success Response:
  - status: `200 OK`
    ```json
    {
      "message": "User delete successfully",
      "userId": "deleted_user_id"
    }
    ```
- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
    - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

### Transaction Management APIs

#### Get All Transactions

**Endpoint:** `GET /transactions?userId=&transactionId=&days=&status=&method=&gta=&lta=&page=&limit=`
**Access:** Admin, SuperAdmin<br>
**Description:** Get a list of all transactions with optional filters.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Query Parameters

| Field           | Type   | Required | Description                                                     |
| --------------- | ------ | -------- | --------------------------------------------------------------- |
| `userId`        | String | No       | Filter transactions by user ID.                                 |
| `transactionId` | String | No       | Filter transactions by transaction ID.                          |
| `days`          | Number | No       | Filter transactions from the last 'n' days.                     |
| `status`        | String | No       | Filter transactions by status (e.g., SUCCESS, FAILED, PENDING). |
| `method`        | String | No       | Filter transactions by payment method (e.g., card, wallet).     |
| `gta`           | Number | No       | Filter transactions with amount greater than this value.        |
| `lta`           | Number | No       | Filter transactions with amount less than this value.           |
| `limit`         | Number | No       | Number of transactions to return (default: 50).                 |
| `page`          | Number | No       | Page number for pagination (default: 1).                        |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Transactions List",
      "transactions": ["array_of_transaction_objects"],
      "pagination": {
        "total": "total_number_of_transactions",
        "page": "current_page_number",
        "pages": "total_number_of_pages",
        "next": "next_page_number_or_null",
        "prev": "previous_page_number_or_null"
      }
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```

#### Refund Transaction

**Endpoint:** `PUT /transactions/refund`
**Access:** Admin, SuperAdmin<br>
**Description:** Refund a specific transaction.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `userId`        | String | Yes      | ID of the user to refund.        |
| `transactionId` | String | Yes      | ID of the transaction to refund. |
| `reason`        | String | Yes      | Reason for the refund.           |

- Success Response:

  - status: `200 OK`
    ```json
    {
      "message": "Transaction refunded successfully",
      "transaction": "refunded_transaction_data_object"
    }
    ```

- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Transaction not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Only successful transactions can be refunded."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "This transaction does not belong to the specified user"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Refund transaction cannot be refunded again"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Please provide a valid reason (at least 5 words)"
    }
    ```

#### Deduct Amount from User Wallet

**Endpoint:** `PUT /transactions/deduct`
**Access:** Admin, SuperAdmin<br>
**Description:** Deduct a specific amount from a user's wallet.

##### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

##### Body Request

| Field    | Type   | Required | Description                              |
| -------- | ------ | -------- | ---------------------------------------- |
| `userId` | String | Yes      | ID of the user to deduct from.           |
| `fund`   | Number | Yes      | Amount to deduct from the user's wallet. |
| `reason` | String | Yes      | Reason for the deduction.                |

- Success Response:
  - status: `200 OK`
    ```json
    {
      "message": "Amount deducted successfully from user wallet",
      "transaction": "deduction_transaction_data_object"
    }
    ```
- Error Responses:
  - status: `400 Bad Request`
    ```json
    {
      "message": "Validation Error Message"
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "User not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "User has insufficient balance"
    }
    ```
  - status: `401 Unauthorized`
    ```json
    {
      "message": "Token invalid."
    }
    ```
  - status: `403 Forbidden`
    ```json
    {
      "message": "Access denied."
    }
    ```
  - status: `404 Not Found`
    ```json
    {
      "message": "Admin not found"
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Deduction amount must be greater than zero."
    }
    ```
  - status: `400 Bad Request`
    ```json
    {
      "message": "Please provide a valid reason (at least 5 words)"
    }
    ```
