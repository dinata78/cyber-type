import "../../styles/index.css"
import "../../styles/tokens.css"
import styles from "./App.module.css"
import { Route, Routes } from "react-router-dom"
import { Header } from "../header/Header/Header"
import { Lobby } from "../lobby/Lobby/Lobby"
import { SoloPlay } from "../SoloPlay/SoloPlay"
import { UserProfile } from "../user-profile/UserProfile/UserProfile"

function App() {
  return (
    <div className={styles.mainContainer}>
      <Header />

      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/solo" element={<SoloPlay />} />
        <Route path="/user/:username" element={<UserProfile />} />
      </Routes>
    </div>
  )
}

export default App