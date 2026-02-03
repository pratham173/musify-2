# musify-2

A modern music streaming web application built with React, TypeScript, and Vite, featuring real-time music playback powered by the Jamendo API.

## Features

- 🎵 **Stream Free Music** - Access thousands of legal, free-to-stream tracks from Jamendo
- 🔍 **Smart Search** - Search for tracks, albums, and artists with real-time results
- 🎨 **Genre Browsing** - Explore music by genre (Rock, Pop, Electronic, Jazz, Hip Hop, and more)
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Theme Support** - Light and dark mode themes
- 🎧 **Full Music Player** - Play, pause, skip, shuffle, and repeat controls
- 📋 **Queue Management** - Build and manage your playback queue
- 💾 **Local Library** - Save your favorite tracks for offline access
- 🎯 **Media Session API** - Control playback from browser, keyboard, and system controls

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router 6
- **State Management**: React Context API
- **Styling**: CSS Modules
- **Music API**: Jamendo API v3.0
- **Storage**: IndexedDB for offline data
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pratham173/musify-2.git
   cd musify-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

   The app comes with a demo Jamendo API client ID that works out of the box. For production use, get your own free API key:

   - Visit [Jamendo Developer Portal](https://developer.jamendo.com/)
   - Sign up for a free account
   - Create a new application to get your Client ID
   - Update `VITE_JAMENDO_CLIENT_ID` in your `.env` file

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## API Configuration

### Jamendo API

The app uses the [Jamendo API](https://api.jamendo.com/v3.0) to stream legal, free music. The API provides:

- **Track Search**: Find songs by keyword, artist, or album
- **Genre Filtering**: Browse music by genre tags
- **Popular Tracks**: Discover trending and featured music
- **New Releases**: Latest uploaded tracks
- **Artist & Album Info**: Complete metadata and artwork

**API Features:**
- Free tier with generous rate limits
- No credit card required
- Legal music streaming
- High-quality audio (MP3 format)
- Album artwork and metadata

**Rate Limits:**
- Demo client ID: ~100 requests per minute
- Personal client ID: Higher limits based on your plan

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_JAMENDO_CLIENT_ID` | Your Jamendo API client ID | `4366f696` (demo) |
| `VITE_SUPABASE_URL` | Supabase project URL (optional) | - |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key (optional) | - |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── icons/       # SVG icon components
│   ├── layout/      # Layout components (Sidebar, Header)
│   ├── player/      # Music player components
│   └── ui/          # Generic UI components (Button, Card, etc.)
├── context/         # React context providers
│   ├── PlayerContext.tsx    # Audio player state
│   ├── ThemeContext.tsx     # Theme management
│   └── LibraryContext.tsx   # User library
├── pages/           # Page components
│   ├── Browse.tsx            # Browse/Home page
│   ├── Search.tsx            # Search page
│   ├── Library.tsx           # User library
│   ├── AlbumDetail.tsx       # Album details
│   ├── ArtistDetail.tsx      # Artist profile
│   └── PlaylistDetail.tsx    # Playlist view
├── services/        # External services
│   ├── jamendoAPI.ts         # Jamendo API integration
│   └── indexedDB.ts          # Local storage
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── styles/          # Global styles
```

## Usage Guide

### Browsing Music

1. **Home/Browse Page**: Discover featured tracks and new releases
2. **Genre Cards**: Click any genre to explore music in that category
3. **Track Cards**: Hover over any track to see the play button

### Searching

1. Navigate to the Search page
2. Type your query in the search bar
3. Results are automatically filtered as you type (300ms debounce)
4. Switch between Tracks, Albums, and Artists tabs

### Playing Music

1. Click the play button on any track card
2. Use the player bar at the bottom to control playback
3. Seek through the track using the progress bar
4. Adjust volume with the volume slider
5. Enable shuffle and repeat modes

### Keyboard Shortcuts

The app supports Media Session API, allowing you to:
- Play/Pause with media keys
- Skip tracks with next/previous buttons
- Control playback from your keyboard or system UI

## Features in Detail

### Music Player
- **Playback Controls**: Play, pause, skip forward/back
- **Seek Bar**: Click or drag to jump to any position
- **Volume Control**: Adjust volume or mute
- **Shuffle**: Randomize playback order
- **Repeat Modes**: Off, repeat all, repeat one
- **Queue Management**: View and reorder upcoming tracks

### Search & Discovery
- **Real-time Search**: Debounced search with instant results
- **Multi-category**: Search across tracks, albums, and artists
- **Genre Filtering**: Browse by musical genre
- **Popular Tracks**: Discover trending music
- **New Releases**: Find recently uploaded tracks

### Library Management
- **Save Tracks**: Add tracks to your personal library
- **Create Playlists**: Organize tracks into custom playlists
- **Offline Access**: Downloaded tracks work without internet

### Theme System
- **Light/Dark Mode**: Toggle between themes
- **Accent Colors**: Customize the color scheme
- **Persistent Settings**: Theme preferences saved locally

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Performance

- **Lazy Loading**: Components load on demand
- **API Caching**: Responses cached for 5 minutes
- **Optimized Images**: Album artwork lazy-loaded
- **Code Splitting**: Route-based chunking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Credits

- Music provided by [Jamendo](https://www.jamendo.com/)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Icons and UI inspired by modern music streaming apps

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/pratham173/musify-2/issues) on GitHub.