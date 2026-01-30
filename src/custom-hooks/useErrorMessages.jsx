
export function useErrorMessages() {
  const errorMessages = {
    "EMPTY_FIELDS": "Please make sure you leave no field empty.",

    "INVALID_USERNAME_FORMAT": "Username can only contain letters, numbers, and spaces.",

    "INVALID_USERNAME_LENGTH": "Username length can't exceed 16 characters.",

    "INVALID_PASSWORD_LENGTH": "Password length should be between 8 to 64 characters.",

    "USERNAME_ALREADY_EXISTS": "Username already exists. Please try using another username to register.",

    "EMAIL_ALREADY_EXISTS": "Email in use. Please try using another email to register.",

    "USERNAME_NOT_FOUND": "Username not found.",

    "WRONG_PASSWORD": "Wrong password. Please make sure you entered the correct password, or try again later.",

    "USER_DISABLED": "This account has been disabled.",

    // fallback

    "INTERNAL_SERVER_ERROR": "An error occured. Please try again later.",
  };

  const getErrorMessage = (code) => {
    const errorMessage = errorMessages[code] || errorMessages["INTERNAL_SERVER_ERROR"];

    return errorMessage;
  }

  return { getErrorMessage }
}