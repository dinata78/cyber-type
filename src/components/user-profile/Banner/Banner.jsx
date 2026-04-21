import styles from "./Banner.module.css";

export function Banner({ username, bio, imageUrl, bestSpeed, playerRating, totalGamesPlayed, totalGamesWon }) {
  
  return (
    <div className={styles.mainContainer}>
      <img
        className={styles.pfp}
        src={imageUrl || "/typer-1.webp"}
      />

      <div className={styles.identity}>
        <div className={styles.username}>
          <span className={styles.tag}>USER</span>
          <span>{username}</span>
        </div>
        <div className={styles.bio}>
          <span className={styles.tag}>BIO</span>
          <span>{bio}</span>
        </div>
      </div>

      <div className={styles.records}>
        <div className={styles.recordsItem}>
          <div className={styles.recordsTag}>
            BEST SPEED (WPM)
          </div>
          <div className={styles.recordsData}>
            <span>{bestSpeed}</span>
          </div>
        </div>

        <div className={styles.recordsItem}>
          <div className={styles.recordsTag}>
            PLAYER RATING (ELO)
          </div>
          <div className={styles.recordsData}>
            <span>{playerRating}</span>
          </div>
        </div>

        <div className={styles.recordsItem}>
          <div className={styles.recordsTag}>
            TOTAL GAMES PLAYED
          </div>
          <div className={styles.recordsData}>
            <span>{totalGamesPlayed}</span>
          </div>
        </div>

        <div className={styles.recordsItem}>
          <div className={styles.recordsTag}>
            TOTAL GAMES WON
          </div>
          <div className={styles.recordsData}>
            <span>{totalGamesWon}</span>
          </div>
        </div>
      </div>
    </div>
  )
}