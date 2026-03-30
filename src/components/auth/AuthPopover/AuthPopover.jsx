import styles from "./AuthPopover.module.css";
import { AuthInput } from "../AuthInput/AuthInput";

export function AuthPopover({ popoverState, onLoginSubmit, onSignupSubmit, errorMessage, isSubmitting }) {

  return (
    <form
      className={styles.mainContainer}
      onSubmit={popoverState === "login" ? onLoginSubmit : onSignupSubmit}
    >
      {
        popoverState === "signup" &&
        <AuthInput
          type={"email"}
          name={"email"}
          label={"Email"}
        />
      }

      <AuthInput
        type={"text"}
        name={"username"}
        label={"Username"}
      />

      <AuthInput
        type={"password"}
        name={"password"}
        label={"Password"}
      />

      <button
        className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ""}`}
        type="submit"
        disabled={isSubmitting}
      >
        {
          isSubmitting ? "LOADING..."
          : popoverState === "login" ? "LOG IN"
          : "SIGN UP" 
        }
      </button>

      {
        errorMessage.length > 0 &&
        <span className={styles.errorMessage}>
          {errorMessage}
        </span>
      }
    </form>
  )
}