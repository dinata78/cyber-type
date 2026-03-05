import styles from "./RoomPlayers.module.css";
import { memo } from "react";
import PlayerCard from "../PlayerCard/PlayerCard";

export default memo(function RoomPlayers({ wpm, accuracy, mistakesCount }) {
  return (
    <div className={styles.mainContainer}>
      <PlayerCard
        cardStyle={"basic"}
        username={"Player 1"}
        imgUrl={null}
        wpm={wpm}
        accuracy={accuracy}
        mistakesCount={mistakesCount}
      />
      <PlayerCard />
      <PlayerCard />
      <PlayerCard />
      <PlayerCard />
    </div>
  )
});