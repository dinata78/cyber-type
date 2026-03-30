import styles from "./Averages.module.css";

export function Averages({ speed, accuracy, mistakesCount }) {

  return (
    <div className={styles.mainContainer}>
      <div className={styles.wrapper}>
        <span className={styles.label}>Speed (WPM)</span>
        <span>{speed || 0}</span>
      </div>

      <div className={styles.wrapper}>
        <span className={styles.label}>Accuracy</span>
        <span>{accuracy|| 0}%</span>
      </div>

      <div className={styles.wrapper}>
        <span className={styles.label}>Mistakes Per Game</span>
        <span>{mistakesCount || 0}</span>
      </div>
    </div>
  )
}
