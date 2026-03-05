import styles from "./RoomStatus.module.css";
import { memo } from "react";

export default memo(function RoomStatus({ gameState, handleNewGame, handleStartGame }) {
  return (
    <div className={styles.mainContainer}>
      <button
        className={styles.button}
        onClick={handleNewGame}
      >
        NEW GAME [CTRL + ENTER]
      </button>

      {
        gameState === "idle" ?
        <button
          className={styles.button}
          onClick={handleStartGame}
        >
          START GAME
        </button>
        : <div className={styles.div}>Game is running!</div>
      }
    </div>
  )
});