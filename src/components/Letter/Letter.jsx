import styles from "./Letter.module.css";
import { memo } from "react";

export default memo(function Letter({ letter, status }) {
  return (
    <p
      className={
        status === "correct" ? `${styles.base} ${styles.correct}`
        : status === "incorrect" ? `${styles.base} ${styles.incorrect}`
        : status === "current" ? `${styles.base} ${styles.current}`
        : styles.base
      }
    >
      {letter}
    </p>
  )
});