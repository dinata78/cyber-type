import styles from "./GameMode.module.css";
import { NavLink } from "../../header/NavLink/NavLink";

export function GameMode() {
  return (
    <div className={styles.mainContainer}>
      <NavLink
        to={"/play"}
        className={styles.joinGame}
      >
        Quick Play
        <span className={styles.description}>
          Play against others
        </span>
      </NavLink>

      <NavLink
        to={"/solo"}
        className={styles.joinGame}
      >
        Solo Play
        <span className={styles.description}>
          Play on your own
        </span>
      </NavLink>

      <NavLink
        to={"/"}
        className={styles.joinGame}
      >
        Group Play
        <span className={styles.description}>
          Play against friends
        </span>
      </NavLink>
    </div>
  )
}