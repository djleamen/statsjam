# StatsJam - NHL Statistics Hub

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Material UI](https://img.shields.io/badge/Material--UI-7-purple)
![Vite](https://img.shields.io/badge/Built%20with-Vite-yellow)
![API](https://img.shields.io/badge/API-SportRadar-orange)
![Last Commit](https://img.shields.io/github/last-commit/djleamen/statsjam)

StatsJam is a modern, responsive web application designed to provide fellow NHL fans with comprehensive team and player statistics in an intuitive interface. Whether you're a die-hard fan or just curious about the latest stats, StatsJam has you covered.

![StatsJam Logo](/public/logo-wide.png)

## 🏒 Features

- **Complete NHL team directory** with official logos and team statistics
- **Detailed player profiles** with photos and comprehensive statistics  
- **NHL playoff bracket viewer** with tournament series tracking
- **Team roster management** with player navigation and detailed roster cards
- **Separate regular season and playoff statistics** for complete player analysis
- **Position-specific stats display** - tailored metrics for goalies vs. skaters
- **Advanced player metrics** and performance analytics
- **Team statistics dashboard** with comprehensive performance metrics
- **Smart navigation** between teams, players, and playoff data
- **Responsive design** for desktop and mobile devices
- **Fast, modern interface** built with React and Material-UI

## 🚀 Tech Stack

StatsJam leverages modern web technologies to deliver a fast, reliable experience:

- **React 19** - Latest version of the popular front-end library
- **Material-UI 7** - Modern UI component library for React
- **Vite** - Next generation frontend tooling
- **JavaScript** - ES6+ syntax for clean, maintainable code
- **SportRadar NHL API** - Access to comprehensive NHL statistics
- **ESPN Media** - Source for team logos and player images

## 📊 Data Sources

All NHL statistics are provided by the [SportRadar NHL API](https://developer.sportradar.com/docs/read/hockey/NHL_v7), ensuring accurate and up-to-date information. Team logos and player photos are sourced from ESPN's comprehensive media library.

> **Note**: This application uses the SportRadar trial API, which may have rate limits and seasonal data restrictions. Some statistics may not be available during off-season periods.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/statsjam.git
cd statsjam
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create `.env` file with your SportRadar API key
```
VITE_SPORT_RADAR_API_KEY=your_api_key_here
VITE_NHL_SEASON=2024
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📱 Usage

- **Browse teams** - View the complete list of NHL teams with logos and basic info
- **Team details** - Click on any team to view roster, statistics, and team performance
- **Player profiles** - Click on any player to see detailed stats, photos, and career information
- **Playoff bracket** - Navigate to the Playoffs section to view tournament brackets and series
- **Season data** - Access both regular season and playoff statistics where available
- **Responsive design** - Enjoy the same experience on desktop, tablet, or mobile devices

## 📝 License

© 2025 StatsJam. All rights reserved.

---

Created for NHL fans who love statistics and clean design
