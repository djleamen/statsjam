import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toolbar } from '@mui/material'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Team from './pages/Team'
import Player from './pages/Player'
import PlayoffBracket from './pages/PlayoffBracket'
import About from './pages/About'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Toolbar /> {/* This creates spacing for the fixed navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:teamId" element={<Team />} />
        <Route path="/player/:playerId" element={<Player />} />
        <Route path="/playoffs" element={<PlayoffBracket />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
