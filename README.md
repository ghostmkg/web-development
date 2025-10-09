# 🎬 Netflix Clone

A stunning Netflix clone built with React, Vite, and Firebase - bringing the cinematic experience to your browser! 🍿

## ✨ Features

### 🎭 **Movie & TV Show Experience**
- 🎯 **TMDB API Integration**: Real-time movie data, stunning posters, detailed descriptions, and trailer links
- 🖱️ **Interactive Movie Cards**: Click any poster to dive into detailed information and watch epic trailers
- 📺 **Built-in Video Player**: Seamless trailer playback with full-screen support
- 🔄 **Dynamic Content Categories**: 
  - 🔥 Trending Now
  - ⭐ Popular Movies
  - 🏆 Top Rated
  - 🆕 Now Playing
  - 📅 Upcoming Releases
- 📊 **Rich Movie Details**: Ratings, release dates, genres, cast, and compelling plot summaries

### 🔐 **User Authentication & Security**
- 🛡️ **Firebase Authentication**: Enterprise-grade security for user accounts
- 📧 **Email/Password Login**: Quick and secure account creation and sign-in
- 🔄 **Session Management**: Persistent login sessions with smart auto-logout
- 👤 **Personalized Profiles**: Customized experience for each user
- 🔒 **Environment Variables**: All sensitive data securely stored and protected

### 📱 **Responsive & Adaptive Design**
- 📲 **Mobile-First Approach**: Perfect experience on smartphones and tablets
- 🖥️ **Desktop Optimized**: Full Netflix-like experience on larger screens
- 🎨 **Adaptive Layouts**: Seamlessly adjusts to any screen size or orientation
- 👆 **Touch-Friendly**: Optimized gestures and interactions for mobile devices
- 🌐 **Cross-Browser Compatible**: Works flawlessly across all modern browsers

### 🎨 **User Interface & Experience**
- 🌙 **Netflix-Inspired Dark Theme**: Authentic cinematic atmosphere
- ✨ **Smooth Animations**: Elegant hover effects and seamless transitions
- 🧭 **Intuitive Navigation**: Easy-to-use navbar with instant search access
- ⏳ **Loading States**: Beautiful loading animations while fetching content
- 🎪 **Hero Banner**: Eye-catching featured content with action buttons

### 🔍 **Advanced Search Functionality**
- ⚡ **Real-time Search**: Instant results as you type
- 🎬 **Movie & TV Show Discovery**: Find any content from TMDB's vast database
- 📱 **Responsive Search Interface**: Works perfectly on all devices
- 🚧 **Note**: Search results currently display-only (enhanced interaction coming soon!)

### 🛠️ **Technical Excellence**
- ⚛️ **React 19**: Latest React version for optimal performance and features
- ⚡ **Vite**: Lightning-fast development server and build tool
- 🔥 **Firebase Integration**: Real-time database and cloud authentication
- 🌐 **TMDB API**: Seamless integration with The Movie Database
- 🚀 **Modern JavaScript**: ES6+ features and contemporary development practices
- 📦 **Component Architecture**: Modular, reusable, and maintainable code structure

## 🚀 Setup Instructions

### 📋 Prerequisites

- 🟢 Node.js (v14 or higher)
- 📦 npm or yarn
- 🔥 Firebase project
- 🎬 TMDB Access Token (for movie data)

### ⚡ Installation

1. 📥 **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Netflix-Clone
   ```

2. 📦 **Install dependencies:**
   ```bash
   npm install
   ```

3. 🔧 **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values in `.env`

4. 🔥 **Firebase Setup:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Get your Firebase config from Project Settings
   - Add the config values to your `.env` file

5. 🎬 **TMDB API Setup:**
   - Create an account at [TMDB](https://www.themoviedb.org/)
   - Go to Settings > API and get your "Read Access Token"
   - Add your TMDB Access Token to the `.env` file

6. 🎉 **Run the development server:**
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# 🔥 Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# 🎬 TMDB API Configuration
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
```

## 🎯 How It Works

### 🎬 **Movie Browsing Experience**
1. 🏠 **Homepage Display**: Movies fetched from TMDB API in stunning Netflix-style rows
2. 🖱️ **Interactive Cards**: Hover over posters for instant previews with titles and ratings
3. ▶️ **Click to Watch**: Single click opens immersive video player with movie trailers
4. 🔄 **Seamless Navigation**: Browse categories without any page reloads

### 🔍 **Search Functionality**
- ⚡ Type in the search bar for real-time movie and TV show discovery
- 🎯 Results fetched instantly from TMDB's massive database
- 📱 Responsive search interface works perfectly on all devices
- 🚧 **Note**: Search results currently display-only (enhanced interaction coming soon!)

### 📱 **Responsive Design Details**
- 📲 **Mobile (320px+)**: Single column layout with touch-optimized controls
- 📟 **Tablet (768px+)**: Two-column grid with enhanced touch interactions
- 🖥️ **Desktop (1024px+)**: Full Netflix-like experience with hover effects
- 🖨️ **Large Screens (1440px+)**: Optimized spacing and larger movie cards

### 🎥 **Video Player Features**
- ▶️ **Trailer Playback**: Automatically loads and plays movie trailers from TMDB
- 🔍 **Full-Screen Mode**: Click to expand video to immersive full screen
- 🎮 **Responsive Controls**: Touch and keyboard controls for all devices
- ↩️ **Auto-Close**: Easy navigation back to movie browsing

## 🏗️ Building for Production

```bash
npm run build
```

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌟 Create your feature branch
3. 💾 Commit your changes
4. 🚀 Push to the branch
5. 📝 Create a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE). 🎉
