import styles from "./AuthButton.module.css";

export function AuthButton({ popoverState, handleLogInClick, handleSignUpClick }) {
  return (
    <div className={styles.mainContainer}>
      <button
        className={`${styles.button}${popoverState === "login" ? " " + styles.selected : ""}`}
        onClick={handleLogInClick}
      >
        LOG IN
      </button>

      <button
        className={`${styles.button}${popoverState === "signup" ? " " + styles.selected : ""}`}
        onClick={handleSignUpClick}
      >
        SIGN UP
      </button>
    </div>
  )
}