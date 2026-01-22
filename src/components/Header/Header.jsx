import styles from "./Header.module.css";
import { NavLink } from "../NavLink/NavLink";

export function Header() {
  return (
    <header className={styles.mainContainer}>
      <NavLink
        to={"/"}
        children={"CYBERTYPE"}
        className={styles.logo}
      />

      <NavLink
        to={"/"}
        children={"LOBBY"}
        className={styles.navLink}
      />

      <NavLink
        to={"/forum"}
        children={"FORUM"}
        className={styles.navLink}
      />

      <NavLink
        to={"/leaderboard"}
        children={"LEADERBOARD"}
        className={styles.navLink}
      />
    </header>
  )
}