import styles from "./Word.module.css";
import { memo } from "react";
import Letter from "../Letter/Letter";

export default memo(function Word({ word, typedWord, wordStatus, currentLetterIndex }) {
  const letters = word.split("");

  return (
    <div className={styles.mainContainer}>
      {
        letters.map((letter, index) => {
          let status = "";

          if (wordStatus === "past") {
            status = "correct"
          }
          else if (wordStatus === "current") {
            if (index < currentLetterIndex) {
              status = letter === typedWord[index] ? "correct" : "incorrect"
            }
            else if (index === currentLetterIndex) {
              status = "current";
            }
          }

          return (
            <Letter
              key={index}
              letter={letter}
              status={status}
            />
          )
        })
      }
    </div>
  );
});