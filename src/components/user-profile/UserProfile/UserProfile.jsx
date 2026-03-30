import styles from "./UserProfile.module.css";
import { useParams } from "react-router-dom";
import { Averages } from "../Averages/Averages";
import { Banner } from "../Banner/Banner";
import { MatchHistory } from "../MatchHistory/MatchHistory";
import { BestScores } from "../BestScores/BestScores";

export function UserProfile() {
  const { username } = useParams();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridWrapper}>
        <div
          className={`${styles.banner} ${styles.gridItem}`}
        >
          <Banner
            username={username}
            bio={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit consequatur saepe quod placeat eveniet illum atque exercitationem beatae! Fugiat corporis accusantium vitae quibusdam explicabo moles."}
            bestSpeed={131.43}
            playerRating={1000}
            totalGamesPlayed={2278}
            totalGamesWon={2087}
          />
        </div>

        <div
          className={`${styles.average25} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            AVERAGES (RECENT 25)
          </div>

          <Averages
            speed={128.46}
            accuracy={96.08}
            mistakesCount={9.32}
          />
        </div>

        <div
          className={`${styles.averageAll} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            AVERAGES (ALL TIME)
          </div>

          <Averages
            speed={110.67}
            accuracy={94.89}
            mistakesCount={12.78}
          />
        </div>

        <div
          className={`${styles.matches} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            MATCH HISTORY
          </div>

          <MatchHistory />
        </div>

        <div
          className={`${styles.bestScores} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            BEST SCORES
          </div>

          <BestScores />
        </div>
      </div>
    </div>
  )
}