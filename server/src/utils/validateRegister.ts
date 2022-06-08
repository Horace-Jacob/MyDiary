import { UserInputFields } from "./UserInputFields";

export const validateRegister = (fields: UserInputFields) => {
  if (!fields.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email",
      },
    ];
  }

  if (fields.secret.length !== 6) {
    return [
      {
        field: "secret",
        message: "invalid secret code",
      },
    ];
  }

  if (fields.username.trim() === "") {
    return [
      {
        field: "username",
        message: "Invalid username",
      },
    ];
  }

  if (fields.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Cannot include @ sign in username",
      },
    ];
  }

  if (fields.username.length <= 1) {
    return [
      {
        field: "username",
        message: "Length of the user must be greater than 2",
      },
    ];
  }

  if (fields.password.length <= 2) {
    return [
      {
        field: "password",
        message: "Length of the password must be greater than 3",
      },
    ];
  }
  return null;
};
