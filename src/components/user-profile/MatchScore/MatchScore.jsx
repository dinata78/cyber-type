import styles from "./MatchScore.module.css";
import { getTimePassed } from "../../../utils/getTimePassed";

  export function MatchScore({ type, number, quote, difficulty, accuracy, speed, createdAt }) {

  return (
    <div 
      className={
        `${styles.mainContainer} ${type === "best" ? styles.best : ""}`
      }
    >

      <span className={styles.number}>{number}.</span>

      <div className={styles.wrapper}>
        <span>{quote}</span>
        <div>
          <span className={styles[difficulty]}>{difficulty}</span>
          <span>, {getTimePassed(createdAt)} ago</span>
        </div>
      </div>

      {
        type !== "best" &&
        <span className={styles.accuracy}>{accuracy}%</span>
      }

      {
        type !== "best" ?
          <span className={styles.speed}>{speed}</span>
        : <div className={styles.bestSpeed}>
            <span>{speed}</span>
            <span>WPM</span>
          </div>
      }
      
    </div>
  )
}