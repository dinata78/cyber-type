import styles from "./Banner.module.css";

export function Banner({ username, bio, imageUrl, bestSpeed, playerRating, totalGamesPlayed, totalGamesWon, isLoading }) {
  
  return (
    <div className={styles.mainContainer}>
      <div className={styles.pfp}>
        {
          !isLoading &&
          <img
            className={styles.img}
            src={imageUrl || "/typer-1.webp"}
          />          
        }
      </div>

      <div className={styles.identity}>
        <div className={styles.username}>
          {
            !isLoading &&
            <>
              <span className={styles.tag}>USER</span>
              {
                username ? <span>{username}</span>
                : <span className={styles.emptyField}>
                    404 NOT FOUND
                  </span>
              }
            </>
          }
        </div>
        <div className={styles.bio}>
          {
            !isLoading &&
            <>
              <span className={styles.tag}>BIO</span>
              {
                bio ? <span>{bio}</span>
                : <span className={styles.emptyField}>
                    This user doesn't have a bio.
                  </span>
              }
            </>
          }
        </div>
      </div>

      <div className={styles.records}>
        {
          !isLoading &&
          <>
            <div className={styles.recordsItem}>
              <div className={styles.recordsTag}>
                BEST SPEED (WPM)
              </div>
              <div className={styles.recordsData}>
                <span>{bestSpeed || 0}</span>
              </div>
            </div>

            <div className={styles.recordsItem}>
              <div className={styles.recordsTag}>
                PLAYER RATING (ELO)
              </div>
              <div className={styles.recordsData}>
                <span>{playerRating || null}</span>
              </div>
            </div>

            <div className={styles.recordsItem}>
              <div className={styles.recordsTag}>
                TOTAL GAMES PLAYED
              </div>
              <div className={styles.recordsData}>
                <span>{totalGamesPlayed || 0}</span>
              </div>
            </div>

            <div className={styles.recordsItem}>
              <div className={styles.recordsTag}>
                TOTAL GAMES WON
              </div>
              <div className={styles.recordsData}>
                <span>{totalGamesWon || 0}</span>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
}