# AlphaPay API Documentation

**_Base URL_**: http://localhost:3000/api

## Auth APIs

### Register an user

**Endpoint:** `POST /clients/auth`  
**Access:** Public<br>
**Description:** Register a new user.

#### Body Request

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

### Verify OTP

**Endpoint:** `POST /clients/auth/verify-otp`  
**Access:** Public<br>
**Description:** Verify the OTP sent to the user's email.

#### Body Request

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

### Resend OTP

**Endpoint:** `POST /clients/auth/resend-otp`  
**Access:** Public<br>
**Description:** Resend the OTP to the user's email.

#### Body Request

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

### Login User

**Endpoint:** `POST /clients/auth/login`  
**Access:** Public<br>
**Description:** Login an existing user.

#### Body Request

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

### Logout User

**Endpoint:** `POST /clients/auth/logout`  
**Access:** Private<br>
**Description:** Logout the user.

#### Headers

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

## User Profile Management APIs

### Get User Profile

**Endpoint:** `GET /clients/users/profile`  
**Access:** Private<br>
**Description:** Get the user profile details.

#### Headers

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

### Update User Details

**Endpoint:** `PUT /clients/users/update`  
**Access:** Private<br>
**Description:** Update user details.

#### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

#### Body Request

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

### Update User Login Password

**Endpoint:** `PUT /clients/users/update-pass`  
**Access:** Private<br>
**Description:** Update user login password.

#### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

#### Body Request

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

### Update User UPI Pin

**Endpoint:** `PUT /clients/users/update-pin`  
**Access:** Private<br>
**Description:** Update user UPI pin.

#### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

#### Body Request

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

### Delete User Account

**Endpoint:** `DELETE /clients/users/delete`  
**Access:** Private<br>
**Description:** Delete user account.

#### Headers

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

### Search Users

**Endpoint:** ` GET /clients/users/search?query=`  
**Access:** Private<br>
**Description:** Search users by upi id or phone number.

#### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

#### Query Parameters

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

## User Card Management APIs

### Add New Card

**Endpoint:** `POST /clients/cards/register-card`
**Access:** Private<br>
**Description:** Add a new card for the user.

#### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

#### Body Request

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

### Get All Cards

**Endpoint:** `GET /clients/cards/get-cards`
**Access:** Private<br>
**Description:** Get all cards of the logged-in user.

#### Headers

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

### Delete a Card

**Endpoint:** `DELETE /clients/cards/delete-card`
**Access:** Private<br>
**Description:** Delete a specific card of the logged-in user.

#### Headers

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| `authorization` | String | Yes      | Bearer token for authentication. |

#### Query Request

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

## User Bill Management APIs
