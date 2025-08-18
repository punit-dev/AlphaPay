# AlphaPay API Documentation

**_Base URL_**: http://localhost:3000/api

## Authentication Route

- `POST /auth/register`: Register a new user.

  - Request body:
    ```json
    {
      "username": "newUsername",
      "email": "user@example.com",
      "phoneNumber": "1234567890",
      "dateOfBirth": "2000-01-01",
      "fullname": "John Doe",
      "password": "securePassword",
      "upiPin": "1234"
    }
    ```
  - Response:
    ```json
    {
      "message": "User created successfully",
      "authToken": "Authentication_token",
      "user": "user_data_object",
      "otp": false
    }
    ```

- `POST /auth/verifyOtp`: Verify OTP.

  - Request body:
    ```json
    {
      "email": "user@example.com",
      "otp": "verification_otp"
    }
    ```
  - Response:
    ```json
    {
      "message": "OTP Successfully verified"
    }
    ```

- `POST /auth/resendOtp`: Resend the OTP.

  - Request body:
    ```json
    {
      "email": "user@example.com"
    }
    ```
  - Response:
    ```json
    {
      "message": "OTP sent successfully",
      "otp": false
    }
    ```

- `POST /auth/login`: Login user.

  - Request body:
    ```json
    {
      "data": "user@example.com/username",
      "password": "user_password"
    }
    ```
  - Response:
    ```json
    {
      "message": "User logged in successfully",
      "token": "Authorization_token",
      "user": "user_data_object"
    }
    ```

- `POST /auth/logout`: Logout the user.

  - Headers:
    `{"authorization": "Bearer <User_authentication_token>"}`
  - Response:
    ```json
    {
      "message": "Logout successfully"
    }
    ```

## User

- `GET /users/profile`: Get the user data.

  - Headers:
    `{"authorization": "Bearer <User_authentication_token>"}`
  - Response:
    ```json
    {
      "message": "User Profile Details",
      "user": "user_data_object"
    }
    ```

- `PUT /users/update`: user can update data.

  - Headers:
    `{"authorization": "Bearer <User_authentication_token>"}`
  - Request Body:

    ```json
    {
      "username": "updated_username",
      "fullname": "updated_fullname",
      "email": "updated_email",
      "dateOfBirth": "updated_dateOfBirth",
      "phoneNumber": "updated_phoneNumber"
    }
    ```

  - Response:
    ```json
    {
      "message": "User Updated",
      "user": "updated_user_data_updated"
    }
    ```

- `PUT /users/updatePass`: user can update login password.

  - Headers:
    `{"authorization": "Bearer <User_authentication_token>"}`
  - Request Body:

    ```json
    {
      "newPass": "updated_pass"
    }
    ```

  - Response:
    ```json
    {
      "message": "Password is successfully updated"
    }
    ```

- `PUT /users/updatePin`: user can update UPI pin.

  - Headers:
    `{"authorization": "Bearer <User_authentication_token>"}`
  - Request Body:

    ```json
    {
      "newPin": "updated_upi_pin"
    }
    ```

  - Response:
    ```json
    {
      "message": "UPI Pin is successfully updated"
    }
    ```

- `DELETE /users/delete`: user can delete account.

  - Headers:
    `{"authorization": "Bearer <User_authentication_token>"}`

  - Response:
    ```json
    {
      "message": "User Deleted Successfully"
    }
    ```
