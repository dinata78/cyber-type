import styles from "./UserProfile.module.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Averages } from "../Averages/Averages";
import { Banner } from "../Banner/Banner";
import { MatchHistory } from "../MatchHistory/MatchHistory";
import { BestScores } from "../BestScores/BestScores";
import { useBest } from "../../../custom-hooks/useBest";
import { useAverages } from "../../../custom-hooks/useAverages";
import { useUserData } from "../../../custom-hooks/useUserData";
import { useMatchScores } from "../../../custom-hooks/useMatchScores";

export function UserProfile() {
  const { username } = useParams();

  const usernameKey = username.toLowerCase();

  const { userData, isUserDataLoading } = useUserData(usernameKey);
  const { bestScores, bestSpeed, isBestLoading } = useBest(usernameKey);
  const { averages, matchAmount, isAveragesLoading } = useAverages(usernameKey);
  const {
    matchScores,
    matchOffset,
    currentPage,
    goToPage,
    isMatchScoresLoading
  } = useMatchScores(username);

  const isBannerLoading = isUserDataLoading || isBestLoading || isAveragesLoading;
  
  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridWrapper}>
        <div
          className={`${styles.banner} ${styles.gridItem}`}
        >
          <Banner
            username={userData.username}
            bio={userData.bio}
            imageUrl={userData.imageUrl}
            bestSpeed={bestSpeed}
            playerRating={1000}
            totalGamesPlayed={matchAmount}
            totalGamesWon={matchAmount}
            isLoading={isBannerLoading}
          />
        </div>

        <div
          className={`${styles.average25} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            AVERAGES (RECENT 25)
          </div>

          <Averages
            speed={averages.recent?.speed}
            accuracy={averages.recent?.accuracy}
            mistakesCount={averages.recent?.mistakes}
            isLoading={isAveragesLoading}
          />
        </div>

        <div
          className={`${styles.averageAll} ${styles.gridItem}`}
        >
          <div className={styles.label}>
            AVERAGES (ALL TIME)
          </div>

          <Averages
            speed={averages.allTime?.speed}
            accuracy={averages.allTime?.accuracy}
            mistakesCount={averages.allTime?.mistakes}
            isLoading={isAveragesLoading}
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
            currentPage={currentPage}
            totalPage={Math.ceil(matchAmount / 25)}
            goToPage={goToPage}
            matchScores={matchScores}
            matchOffset={matchOffset}
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