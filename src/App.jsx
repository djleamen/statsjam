import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toolbar } from '@mui/material'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Team from './pages/Team'
import Player from './pages/Player'
import About from './pages/About'
import Debug from './pages/Debug'
import SimpleTest from './pages/SimpleTest'
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
        <Route path="/about" element={<About />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/test" element={<SimpleTest />} />
      </Routes>
    </Router>
  )
}

export default App
