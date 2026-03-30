import styles from "./ProfilePopover.module.css";

export function ProfilePopover({ handleProfileClick, handleLogOutClick, isLoggingOut }) {
  return (
    <div className={styles.mainContainer}>
      <button
        className={styles.button}
        onClick={handleProfileClick}
      >
        PROFILE
      </button>

      <button
        className={styles.button}
      >
        SETTINGS
      </button>

      <button
        className={
          `${styles.button} ${styles.logout} ${isLoggingOut ? styles.loggingOut : ""}`
        }
        onClick={handleLogOutClick}
        disabled={isLoggingOut}
      >
        LOG OUT
      </button>
    </div>
  )
}