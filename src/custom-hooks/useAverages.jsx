import { doc, getDoc, runTransaction } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useAverages(username) {
  const [allTime, setAllTime] = useState({});
  const [recent, setRecent] = useState({});
  const [matchAmount, setMatchAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const resetAverages = () => {
    setAllTime({});
    setRecent({});
    setMatchAmount(0);
  }

  useEffect(() => {
    const getAverages = async () => {
      if (!username) {
        resetAverages();
        return;
      }

      setIsLoading(true);
      resetAverages();

      // Declare References
      const matchHistoryRef = doc(db, "matchHistory", username);
      const measurementsRef = doc(db, "measurements", username);

      try {
        // Read Data
        const matchHistorySnapshot = await getDoc(matchHistoryRef);
        const measurementsSnapshot = await getDoc(measurementsRef);

        // Get Match Amount
        const historyMeta = matchHistorySnapshot.data() || { latestPage: 1, countInLatest: 0 }

        const matchAmount = (historyMeta.latestPage - 1) * 25 + historyMeta.countInLatest;

        if (!matchAmount) return;

        // Get New Measurements

        if (measurementsSnapshot.exists()) {
          const measurements = measurementsSnapshot.data();

          const totalAllTimeSpeed = measurements.totalSpeed;
          const totalAllTimeAccuracy = measurements.totalAccuracy;
          const totalAllTimeMistakes = measurements.totalMistakes;

          const totalRecentSpeed = [...measurements.last25SpeedArray].reduce((acc, current) => acc + current, 0);
          const totalRecentAccuracy = [...measurements.last25AccuracyArray].reduce((acc, current) => acc + current, 0);
          const totalRecentMistakes = [...measurements.last25MistakesArray].reduce((acc, current) => acc + current, 0);

          const allTimeSpeedAverage = Math.round(totalAllTimeSpeed / matchAmount * 100) / 100;
          const allTimeAccuracyAverage = Math.round(totalAllTimeAccuracy / matchAmount * 100) / 100;
          const allTimeMistakesAverage = Math.round(totalAllTimeMistakes / matchAmount * 100) / 100;

          const recentSpeedAverage = Math.round(totalRecentSpeed / (matchAmount < 25 ? matchAmount : 25) * 100) / 100;
          const recentAccuracyAverage = Math.round(totalRecentAccuracy / (matchAmount < 25 ? matchAmount : 25) * 100) / 100;
          const recentMistakesAverage = Math.round(totalRecentMistakes / (matchAmount < 25 ? matchAmount : 25) * 100) / 100;

          setAllTime({
            speed: allTimeSpeedAverage,
            accuracy: allTimeAccuracyAverage,
            mistakes: allTimeMistakesAverage,
          });

          setRecent({
            speed: recentSpeedAverage,
            accuracy: recentAccuracyAverage,
            mistakes: recentMistakesAverage,
          });

          setMatchAmount(matchAmount);
        }
        else {
          resetAverages();
        }
      }
      catch (e) {
        resetAverages();
        console.error(e);
      }
      finally {
        setIsLoading(false);
      }
    }

    getAverages();

  }, [username]);

  return {
    averages: { allTime, recent },
    matchAmount,
    isAveragesLoading: isLoading,
  }
}