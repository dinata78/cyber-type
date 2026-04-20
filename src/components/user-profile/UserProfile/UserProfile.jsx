import styles from "./UserProfile.module.css";
import { useParams } from "react-router-dom";
import { Averages } from "../Averages/Averages";
import { Banner } from "../Banner/Banner";
import { MatchHistory } from "../MatchHistory/MatchHistory";
import { BestScores } from "../BestScores/BestScores";
import { useBest } from "../../../custom-hooks/useBest";
import { useMatchAmount } from "../../../custom-hooks/useMatchAmount";
import { useAverages } from "../../../custom-hooks/useAverages";

export function UserProfile() {
  const { username } = useParams();

  const usernameKey = username.toLowerCase();

  const { bestScores, bestSpeed } = useBest(usernameKey);
  const { matchAmount } = useMatchAmount(usernameKey);
  const { averages } = useAverages(usernameKey, matchAmount);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridWrapper}>
        <div
          className={`${styles.banner} ${styles.gridItem}`}
        >
          <Banner
            username={username}
            bio={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit consequatur saepe quod placeat eveniet illum atque exercitationem beatae! Fugiat corporis accusantium vitae quibusdam explicabo moles."}
            bestSpeed={bestSpeed}
            playerRating={1000}
            totalGamesPlayed={matchAmount}
            totalGamesWon={matchAmount}
          />
        </div>

        <div
          className={`${styles.average25} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            AVERAGES (RECENT 25)
          </div>

          <Averages
            speed={averages.recent?.speed || null}
            accuracy={averages.recent?.accuracy || null}
            mistakesCount={averages.recent?.mistakes || null}
          />
        </div>

        <div
          className={`${styles.averageAll} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            AVERAGES (ALL TIME)
          </div>

          <Averages
            speed={averages.allTime?.speed || null}
            accuracy={averages.allTime?.accuracy || null}
            mistakesCount={averages.allTime?.mistakes || null}
          />
        </div>

        <div
          className={`${styles.matches} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            MATCH HISTORY
          </div>

          <MatchHistory
            username={username}
            totalPage={Math.ceil(matchAmount / 25)}
          />
        </div>

        <div
          className={`${styles.bestScores} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            BEST SCORES
          </div>

          <BestScores bestScores={bestScores} />
        </div>
      </div>
    </div>
  )
}