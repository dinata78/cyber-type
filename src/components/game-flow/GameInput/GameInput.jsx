import styles from "./GameInput.module.css";
import { useEffect } from "react";

export function GameInput({ gameState, setGameRunning, gameInputRef, focusGameInput, typedWord, isTypedCorrect, onChange }) {

  const onKeyDown = (e) => {
    if (gameState === "idle" && e.key === " ") {
      e.preventDefault();
      setGameRunning();
    }

    if (gameState === "idle") {
      e.preventDefault();
      return;
    }
  }

  useEffect(() => {
    focusGameInput();
    console.log("Focused input.")
  }, []);

  return (
    <div className={`${styles.mainContainer} ${!isTypedCorrect ? styles.incorrect : ""}`}>
      <div className={styles.border}>
        <input
          className={styles.input}
          ref={gameInputRef}
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={
            gameState === "idle" ? "Press [SPACE] here to start"
            : ""
          }
          value={typedWord}
        />
      </div>
    </div>
  )
}