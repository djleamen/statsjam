# StatsJam - NHL Statistics Hub

StatsJam is a modern, responsive web application designed to provide fellow NHL fans with comprehensive team and player statistics in an intuitive interface. Whether you're a die-hard fan or just curious about the latest stats, StatsJam has you covered.

![StatsJam Logo](/public/logo-wide.png)

## 🏒 Features

- **Complete NHL team directory** with official logos
- **Detailed player profiles** with photos and statistics
- **Real-time season statistics** and performance metrics
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

- Browse the complete list of NHL teams
- Click on any team to view roster and team statistics
- View detailed player profiles with performance metrics
- Explore current season statistics for teams and players

## 📝 License

© 2025 StatsJam. All rights reserved.

---

Created for NHL fans who love statistics and clean design
