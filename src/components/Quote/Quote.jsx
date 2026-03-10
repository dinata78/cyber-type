import styles from "./Quote.module.css";
import Word from "../Word/Word";

export function Quote({ targetWords, currentWordIndex, currentLetterIndex, typedWord, origin, difficulty }) {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <span>{origin}</span>
        <span
          className={`${styles[difficulty?.toLowerCase()]}`}
        >
          [{difficulty}]
        </span>
      </div>
      <div className={styles.wordsContainer}>
        {
          targetWords.map((word, index) => {
            return (
              <Word
                key={index}
                word={word + " "}
                typedWord={index === currentWordIndex ? typedWord : null}
                wordStatus={
                  index < currentWordIndex ? "past"
                  : index > currentWordIndex ? "future"
                  : "current"
                }
                currentLetterIndex={index === currentWordIndex ? currentLetterIndex : null}
              />
            )
          })
        }
      </div>
    </div>
  )
}