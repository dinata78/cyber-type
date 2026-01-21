import styles from "./GameInput.module.css";
import { useEffect, useRef } from "react";

export function GameInput({ typedWord, onChange, isDisabled }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    console.log("Focused input.")
  }, []);

  return (
    <input
      className={styles.gameInput}
      ref={inputRef}
      type="text"
      disabled={isDisabled}
      onChange={onChange}
      value={typedWord}
    />
  )
}