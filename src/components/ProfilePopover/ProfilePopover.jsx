import styles from "./ProfilePopover.module.css";
import { NavLink } from "../NavLink/NavLink";

export function ProfilePopover({ handleLogOut }) {
  return (
    <div className={styles.mainContainer}>
      <NavLink
        to={`/user/myUsername`}
        className={styles.button}
      >
        PROFILE
      </NavLink>

      <button
        className={styles.button}
      >
        SETTINGS
      </button>

      <button
        className={`${styles.button} ${styles.logout} `}
        onClick={handleLogOut}
      >
        LOG OUT
      </button>
    </div>
  )
}