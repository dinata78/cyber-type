import { PlayerScore } from "../PlayerScore/PlayerScore"
import styles from "./QuoteLeaderboard.module.css"

const fakeData = [
  {
    id: "0001",
    playerName: "Awesomely Faster",
    speed: 175.96,
    createdAt: new Date("2024-12-06T13:49:52"),
  },
  {
    id: "0002",
    playerName: "Alpha",
    speed: 124.69,
    createdAt: new Date("2025-10-24T23:59:59"),
  },
  {
    id: "0003",
    playerName: "Beta",
    speed: 98.4,
    createdAt: new Date("2026-03-06T20:45:52"),
  },
  {
    id: "0004",
    playerName: "Omega",
    speed: 146.2,
    createdAt: new Date("2026-03-06T22:10:40"),
  },
  {
    id: "0005",
    playerName: "Sigma",
    speed: 124.3,
    createdAt: new Date("2026-03-06T21:51:10"),
  },
    {
    id: "0006",
    playerName: "Gamma",
    speed: 99,
    createdAt: new Date("2026-03-05T22:07:52"),
  },
  {
    id: "0007",
    playerName: "Epsilon",
    speed: 78.3,
    createdAt: new Date("2026-03-06T21:59:52"),
  },
  {
    id: "0008",
    playerName: "Player 1",
    speed: 12.63,
    createdAt: new Date("2023-02-06T11:39:57"),
  },
  {
    id: "0009",
    playerName: "Player 2",
    speed: 46,
    createdAt: new Date("2025-12-06T13:49:52"),
  },
  {
    id: "0010",
    playerName: "Player 999",
    speed: 198.99,
    createdAt: new Date("2021-11-04T08:18:28"),
  },
];

export function QuoteLeaderboard() {
  const sortedData = fakeData.toSorted((a, b) => b.speed - a.speed)

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>BEST SCORES</div>
      <div className={styles.scores}>
        {
          sortedData.map((data, index) => {
            return (
              <PlayerScore
                key={index + data.id}
                rank={index + 1}
                playerName={data.playerName}
                speed={data.speed}
                createdAt={data.createdAt}
              />
            )
          })
        }
      </div>
    </div>
  )
}