import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useAverages(username, matchAmount) {
  const [allTime, setAllTime] = useState({});
  const [recent, setRecent] = useState({});

  useEffect(() => {    
    (async () => {
      if (!username) return;
      if (!matchAmount) return;

      try {
        const docRef = doc(db, "measurements", username);

        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const measurements = snapshot.data();

          const totalAllTimeSpeed = measurements.totalSpeed;
          const totalAllTimeAccuracy = measurements.totalAccuracy;
          const totalAllTimeMistakes = measurements.totalMistakes;

          const totalRecentSpeed = [...measurements.last25SpeedArray].reduce((acc, current) => acc + current, 0);
          const totalRecentAccuracy = [...measurements.last25AccuracyArray].reduce((acc, current) => acc + current, 0);
          const totalRecentMistakes = [...measurements.last25MistakesArray].reduce((acc, current) => acc + current, 0);

          const allTimeSpeedAverage = Math.round(totalAllTimeSpeed / matchAmount * 100) / 100;
          const allTimeAccuracyAverage = Math.round(totalAllTimeAccuracy / matchAmount * 100) / 100;
          const allTimeMistakesAverage = Math.round(totalAllTimeMistakes / matchAmount * 100) / 100;

          const recentSpeedAverage = Math.round(totalRecentSpeed / (matchAmount <= 25 ? matchAmount : 25) * 100) / 100;
          const recentAccuracyAverage = Math.round(totalRecentAccuracy / (matchAmount <= 25 ? matchAmount : 25) * 100) / 100;
          const recentMistakesAverage = Math.round(totalRecentMistakes / (matchAmount <= 25 ? matchAmount : 25) * 100) / 100;

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
        }
        else {
          setAllTime({});
          setRecent({});
        }
      }
      catch (e) {
        console.error(e);
      }
    })();
  }, [username, matchAmount]);

  return {
    averages: {
      allTime,
      recent,
    }
  }
}