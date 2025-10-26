# GitHub Copilot Instructions for StatsJam

## Project Overview

StatsJam is a modern React-based web application that provides NHL statistics and information. It's built with React 19, Material-UI 7, and Vite, and integrates with the SportRadar NHL API for real-time statistics.

## Tech Stack

- **Frontend Framework**: React 19 with React Router DOM v7
- **UI Library**: Material-UI (MUI) v7 with Emotion for styling
- **Build Tool**: Vite 6.x
- **HTTP Client**: Axios for API requests
- **JavaScript**: ES6+ modules, JSX syntax
- **Node.js**: Requires v18.0.0 or higher

## Project Structure

```
/src
  /api          - API client configuration and endpoints (nhl.js)
  /components   - Reusable React components (Navbar, Footer, TeamLogo, PlayerAvatar)
  /pages        - Route-level page components (Home, Team, Player, PlayoffBracket, About)
  /styles       - Global styles and theming utilities
  /assets       - Static assets (images, logos)
  App.jsx       - Main application component with routing
  main.jsx      - Application entry point
  theme.js      - Material-UI theme configuration
```

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally
- `npm test` - Run tests (currently returns success with no tests)

## Coding Conventions

### JavaScript/JSX Style

- Use ES6+ syntax (arrow functions, destructuring, spread operators)
- Use functional components with hooks (no class components)
- Use JSX for component templates
- File extension: `.jsx` for components, `.js` for utilities/API modules
- Component names: PascalCase (e.g., `TeamLogo.jsx`)
- Utility/API files: camelCase (e.g., `nhl.js`)

### ESLint Configuration

- Based on `@eslint/js` recommended rules
- React Hooks rules enforced via `eslint-plugin-react-hooks`
- Unused variables allowed if they match pattern `^[A-Z_]` (for constants)
- Component exports should follow React Refresh patterns
- Ignore `dist` directory

### Material-UI Conventions

- Import components from `@mui/material` and `@mui/icons-material`
- Use the centralized theme defined in `src/theme.js`
- Theme features:
  - Primary color: Blue (#1976d2)
  - Secondary color: Red (#d32f2f)
  - Border radius: 12px for cards, 8px for buttons
  - Typography: Roboto font family
  - Custom component overrides for Card, Button, and Chip

### Component Patterns

1. **Imports order**: External libraries first, then local imports
2. **Prop destructuring**: Extract props in function parameters
3. **Conditional rendering**: Use ternary operators or logical AND
4. **Event handlers**: Name with `handle` prefix (e.g., `handleClick`)
5. **State management**: Use `useState` for local state, consider prop drilling for shared state

### API Integration

- API client configured in `src/api/nhl.js`
- Uses Axios with interceptors for error handling
- Environment variables:
  - `VITE_SPORT_RADAR_API_KEY` - SportRadar API key (required)
  - `VITE_NHL_SEASON` - NHL season year (defaults to "2024")
- Development proxy configured in `vite.config.js` to bypass CORS
- API base URL switches between proxy (dev) and direct API (prod)
- Handle common errors: 429 (rate limit), 403 (forbidden), 404 (not found), 500 (server error)

### Routing

- React Router DOM v7 used for navigation
- Routes defined in `App.jsx`:
  - `/` - Home page with team list
  - `/team/:teamId` - Team details and roster
  - `/player/:playerId` - Player profile and stats
  - `/playoffs` - Playoff bracket viewer
  - `/about` - About page
- Use `useNavigate` hook for programmatic navigation
- Use `useParams` hook to access route parameters

## Environment Setup

Required `.env` file in project root:
```
VITE_SPORT_RADAR_API_KEY=your_api_key_here
VITE_NHL_SEASON=2024
```

## Important Notes

1. **API Limitations**: Uses SportRadar trial API with rate limits and seasonal restrictions
2. **Image Sources**: Team logos and player photos from ESPN media library
3. **No Test Framework**: Currently no unit tests configured (test script returns success)
4. **Build Output**: Production builds go to `dist/` directory (git-ignored)
5. **Node Modules**: Always git-ignored, commit only package.json and package-lock.json
6. **Responsive Design**: All components should work on desktop, tablet, and mobile

## Best Practices for Contributors

1. Always run `npm run lint` before committing code
2. Test API integrations with valid SportRadar API key
3. Ensure responsive design on multiple screen sizes
4. Follow existing component structure and naming conventions
5. Add proper error handling for API calls
6. Use Material-UI components consistently with the app theme
7. Keep components focused and single-purpose
8. Document complex logic with comments when necessary
9. Handle loading and error states in API-dependent components
10. Test in both development (with proxy) and production builds

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx` if needed
4. Follow existing page structure patterns

### Adding a New Component
1. Create `.jsx` file in `src/components/`
2. Use functional component with hooks
3. Import Material-UI components as needed
4. Apply theme via `sx` prop or styled components
5. Export as default

### Adding API Endpoints
1. Add function to `src/api/nhl.js`
2. Use existing axios instance for consistency
3. Handle errors with try-catch
4. Return meaningful error messages

### Styling Components
1. Use Material-UI `sx` prop for one-off styles
2. Reference theme values: `theme.palette`, `theme.typography`
3. Keep custom CSS minimal, prefer Material-UI components
4. Use responsive breakpoints: `xs`, `sm`, `md`, `lg`, `xl`
