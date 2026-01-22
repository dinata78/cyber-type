import styles from "./Lobby.module.css";
import { GameMode } from "../GameMode/GameMode";

export function Lobby() {
  return (
    <div className={styles.mainContainer}>
      <GameMode />
    </div>
  )
}