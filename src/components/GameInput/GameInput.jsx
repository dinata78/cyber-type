import styles from "./GameInput.module.css";
import { useEffect, useRef } from "react";

export function GameInput({ typedWord, onChange, isDisabled }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    console.log("Focused input.")
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.border}>
        <input
          className={styles.input}
          ref={inputRef}
          type="text"
          disabled={isDisabled}
          onChange={onChange}
          value={typedWord}
        />
      </div>
    </div>
  )
}