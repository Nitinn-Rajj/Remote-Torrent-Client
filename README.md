# Remote Torrent Client

A modern, full-stack torrent management system with a beautiful React frontend and a powerful Go backend. Access and manage your torrents from anywhere with remote functionality via ngrok.

## Features

- 🌐 **Modern Web Interface** - Clean, responsive UI built with React, TypeScript, and Tailwind CSS
- 📥 **Torrent Management** - Add, start, stop, and delete torrents via magnet links
- 🎯 **Selective File Download** - Choose which files to download from a torrent instead of downloading everything
- 📁 **Built-in File Manager** - Browse, manage, and organize your downloaded files directly from the client
- 🎬 **Media Streaming** - Stream video and audio files directly from the client without waiting for complete downloads
- 📊 **Real-time Dashboard** - Monitor download progress, speeds, and statistics
- ⚙️ **Configurable Settings** - Customize download paths, upload/download limits, and ports
- 🔒 **Remote Access** - Securely access your torrent client from anywhere using ngrok

## Tech Stack

**Backend:**
- Go 1.23+
- anacrolix/torrent - BitTorrent library
- Custom REST API with CORS support

**Frontend:**
- React 19
- TypeScript
- Redux Toolkit (State Management)
- Tailwind CSS
- Vite (Build Tool)
- Axios (HTTP Client)

---

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Go** 1.23 or higher - [Download Go](https://golang.org/dl/)
- **Node.js** 18+ and npm - [Download Node.js](https://nodejs.org/)

### 1. Extract the Project

Extract the provided ZIP file to your desired location:

```bash
unzip Remote-Torrent-Client.zip
cd Remote-Torrent-Client
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

#### Install Go Dependencies

```bash
go mod download
```

#### Build the Backend

```bash
go build -o remote-torrent
```

#### Configure the Backend (Optional)

The backend creates a `remote-torrent.json` configuration file on first run. You can modify settings such as:
- Download directory
- Upload/Download rate limits
- Port configuration
- DHT, PEX, and seeding options

#### Run the Backend

```bash
./remote-torrent
```

The backend server will start on **port 3000** by default.

**Custom Port:**
```bash
./remote-torrent --port 8080
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

#### Install Node Dependencies

```bash
npm install
```

#### Configure API Endpoint

The frontend uses a `config.json` file to determine the backend API URL. By default, it points to `http://localhost:3000/api`.

**For local development:** No changes needed, the default configuration works.

**For remote access (ngrok):** You'll update this file later in the ngrok setup section.

#### Run the Development Server

```bash
npm run dev
```

The frontend will start on **http://localhost:5173** (or another port if 5173 is busy).

#### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

---

## Setting Up Remote Access with ngrok

To access your torrent client remotely from anywhere, use ngrok to create a secure tunnel to your local backend server.

### 1. Install ngrok

#### Linux / macOS

```bash
# Download ngrok
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz

# Extract
tar -xvzf ngrok-v3-stable-linux-amd64.tgz

# Move to PATH (optional)
sudo mv ngrok /usr/local/bin/
```

#### Or install via snap (Linux)

```bash
snap install ngrok
```

#### Windows / macOS

Download from [ngrok.com/download](https://ngrok.com/download) and follow the installation instructions.

### 2. Sign Up and Get Your Auth Token

1. Create a free account at [ngrok.com](https://ngrok.com/)
2. Navigate to your [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Copy your auth token

### 3. Configure ngrok

Add your auth token:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### 4. Start the Backend Server

Make sure your backend is running:

```bash
cd backend
./remote-torrent
```

### 5. Create ngrok Tunnel

In a new terminal, create a tunnel to your backend (default port 3000):

```bash
ngrok http 3000
```

If you're using a custom port:

```bash
ngrok http 8080
```

### 6. Access Your Application

ngrok will display output like:

```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

**Important:** Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### 7. Update Frontend Configuration

Update your frontend to use the ngrok URL by editing the `config.json` file:

**Edit `frontend/config.json`:**

```json
{
  "apiUrl": "https://abc123.ngrok-free.app/api"
}
```

Replace `https://abc123.ngrok-free.app` with your actual ngrok URL.

**Note:** This config file is automatically copied to the `dist/` folder during build, so you can also modify it there after building for production.

### 8. Restart Frontend Development Server

If you're running the development server, restart it to pick up the new configuration:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

For production builds:

```bash
cd frontend
npm run build
```

The `config.json` will be automatically copied to the `dist/` folder. You can now access your torrent client from anywhere using the ngrok URL!


#### Example: Keep Everything Running with tmux

```bash
# Start tmux
tmux

# Start backend (in first pane)
cd backend && ./remote-torrent

# Split window (Ctrl+B then ")
# Start ngrok (in second pane)
ngrok http 3000

# Detach from tmux (Ctrl+B then D)
# Reattach later with: tmux attach
```

---

## Usage Guide

### Adding Torrents

1. Navigate to the **Dashboard**
2. Click the **"Add Torrent"** button
3. Paste a magnet link
4. Click **"Add"** to start downloading

### Managing Downloads

- **Start/Stop:** Click the play/pause button on any torrent
- **Delete:** Click the delete button to remove a torrent
- **View Progress:** Monitor download speed, upload speed, and completion percentage in real-time

### Browsing Files

1. Click **"Files"** in the sidebar
2. Navigate through your downloaded files
3. Click on files to download them to your local machine

### Configuring Settings

1. Go to **"Settings"** in the sidebar
2. Modify:
   - Download directory path
   - Maximum download/upload speed
   - Port settings
   - DHT and PEX options
   - Seeding behavior
3. Click **"Save"** to apply changes

---

## Project Structure

```
remote-torrent/
├── backend/                 # Go backend
│   ├── main.go             # Entry point
│   ├── engine/             # Torrent engine logic
│   ├── server/             # HTTP server and REST API
│   └── static/             # Static file serving
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
└── README.md              # This file
```

---


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



