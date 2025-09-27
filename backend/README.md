# AlphaPay API Documentation

This document provides a comprehensive guide to the RESTful APIs available in the AlphaPay backend. It includes details about each endpoint, request and response formats, authentication methods, and error handling.

## Base URLs

**_Base URL for Users in local environment_**: http://localhost:3000/api/users<br>
**_Base URL for Admins in local environment_**: http://localhost:3000/api/admins

## Index

- [Users APIs](#-users-apis)
  - [Auth APIs](#-auth-apis)
  - [User Profile Management APIs](#-user-profile-management-apis)
  - [User Card Management APIs](#-user-card-management-apis)
  - [User Bill Management APIs](#-user-bill-management-apis)
  - [Transactions APIs](#-transactions-apis)
  - [Notification APIs](#-notification-apis)

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
