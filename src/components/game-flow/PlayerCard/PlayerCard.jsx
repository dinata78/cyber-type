import styles from "./PlayerCard.module.css";
import { memo } from "react";

export default memo(function PlayerCard({ cardStyle, username, imgUrl, wpm, accuracy, mistakesCount }) {
  const cardStyleClass = cardStyle === "basic" ? styles.basic : null;

  return (
    <div className={`${styles.mainContainer} ${cardStyleClass || ""}`}>
      
      <div className={styles.data}>
        <div className={styles.metrics}>
          <div className={styles.metricPart}>
            Accuracy: {accuracy || 100}%
          </div>
          <div className={styles.metricPart}>
            Errors: {mistakesCount || 0}
          </div>
        </div>
        <div className={styles.player}>
          <img
            className={styles.pfp}
            src={imgUrl || "/typer-1.webp"}
          />
          <div className={styles.username}>
            <span>{username || "<NOT_FOUND>"}</span>
          </div>
        </div>
      </div>

      <div className={styles.speed}>
        <span>{wpm || 0}</span>
        <span>WPM</span>
      </div>
    </div>
  )
});