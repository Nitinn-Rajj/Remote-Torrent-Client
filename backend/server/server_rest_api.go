package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/jpillora/cloud-torrent/engine"
)

// RESTful API handlers for the React frontend

// handleRestAPI routes RESTful API requests
func (s *Server) handleRestAPI(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	path := strings.TrimPrefix(r.URL.Path, "/api")

	switch {
	case path == "/torrents" && r.Method == "GET":
		s.getTorrents(w, r)
	case path == "/torrent" && r.Method == "POST":
		s.addTorrent(w, r)
	case strings.HasPrefix(path, "/torrent/") && strings.HasSuffix(path, "/files") && r.Method == "GET":
		s.getTorrentFiles(w, r)
	case strings.HasPrefix(path, "/torrent/") && strings.HasSuffix(path, "/files") && r.Method == "POST":
		s.updateTorrentFiles(w, r)
	case strings.HasPrefix(path, "/torrent/") && strings.HasSuffix(path, "/start") && r.Method == "POST":
		s.startTorrent(w, r)
	case strings.HasPrefix(path, "/torrent/") && strings.HasSuffix(path, "/stop") && r.Method == "POST":
		s.stopTorrent(w, r)
	case strings.HasPrefix(path, "/torrent/") && r.Method == "DELETE":
		s.deleteTorrent(w, r)
	case path == "/config" && r.Method == "GET":
		s.getConfig(w, r)
	case path == "/config" && r.Method == "PUT":
		s.updateConfig(w, r)
	case path == "/files" && r.Method == "GET":
		s.getFiles(w, r)
	default:
		http.Error(w, "Not Found", http.StatusNotFound)
	}
}

// getTorrents returns all torrents
func (s *Server) getTorrents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	torrents := s.state.Torrents

	json.NewEncoder(w).Encode(torrents)
}

// addTorrent adds a new torrent from magnet link
func (s *Server) addTorrent(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Magnet string `json:"magnet"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Magnet == "" {
		http.Error(w, "Magnet link is required", http.StatusBadRequest)
		return
	}

	if err := s.engine.NewMagnet(req.Magnet); err != nil {
		http.Error(w, fmt.Sprintf("Failed to add torrent: %s", err), http.StatusBadRequest)
		return
	}

	s.state.Push()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

// deleteTorrent removes a torrent by infohash
func (s *Server) deleteTorrent(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/torrent/")
	infohash := path

	if infohash == "" {
		http.Error(w, "Infohash is required", http.StatusBadRequest)
		return
	}

	if err := s.engine.DeleteTorrent(infohash); err != nil {
		http.Error(w, fmt.Sprintf("Failed to delete torrent: %s", err), http.StatusBadRequest)
		return
	}

	s.state.Push()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

// startTorrent starts a torrent by infohash
func (s *Server) startTorrent(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/torrent/")
	infohash := strings.TrimSuffix(path, "/start")

	if infohash == "" {
		http.Error(w, "Infohash is required", http.StatusBadRequest)
		return
	}

	if err := s.engine.StartTorrent(infohash); err != nil {
		http.Error(w, fmt.Sprintf("Failed to start torrent: %s", err), http.StatusBadRequest)
		return
	}

	s.state.Push()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

// stopTorrent stops a torrent by infohash
func (s *Server) stopTorrent(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/torrent/")
	infohash := strings.TrimSuffix(path, "/stop")

	if infohash == "" {
		http.Error(w, "Infohash is required", http.StatusBadRequest)
		return
	}

	if err := s.engine.StopTorrent(infohash); err != nil {
		http.Error(w, fmt.Sprintf("Failed to stop torrent: %s", err), http.StatusBadRequest)
		return
	}

	s.state.Push()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

// getConfig returns the current configuration
func (s *Server) getConfig(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	config := s.engine.Config()

	json.NewEncoder(w).Encode(config)
}

// updateConfig updates the configuration
func (s *Server) updateConfig(w http.ResponseWriter, r *http.Request) {
	var config engine.Config

	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := s.reconfigure(config); err != nil {
		http.Error(w, fmt.Sprintf("Failed to update config: %s", err), http.StatusBadRequest)
		return
	}

	s.state.Push()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.engine.Config())
}

// getFiles returns the file tree from downloads directory
func (s *Server) getFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	s.state.Lock()
	files := s.state.Downloads
	s.state.Unlock()

	json.NewEncoder(w).Encode(files)
}

// getTorrentFiles returns detailed file list for a specific torrent
func (s *Server) getTorrentFiles(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/torrent/")
	infohash := strings.TrimSuffix(path, "/files")

	if infohash == "" {
		http.Error(w, "Infohash is required", http.StatusBadRequest)
		return
	}

	torrent, err := s.engine.GetTorrentFiles(infohash)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get torrent files: %s", err), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(torrent)
}

// updateTorrentFiles updates which files should be downloaded
func (s *Server) updateTorrentFiles(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/torrent/")
	infohash := strings.TrimSuffix(path, "/files")

	if infohash == "" {
		http.Error(w, "Infohash is required", http.StatusBadRequest)
		return
	}

	var req struct {
		FilePaths []string `json:"filePaths"`
		Action    string   `json:"action"` // "start" or "stop"
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if len(req.FilePaths) == 0 {
		http.Error(w, "FilePaths is required", http.StatusBadRequest)
		return
	}

	if req.Action != "start" && req.Action != "stop" {
		http.Error(w, "Action must be 'start' or 'stop'", http.StatusBadRequest)
		return
	}

	download := req.Action == "start"

	if err := s.engine.UpdateFileSelection(infohash, req.FilePaths, download); err != nil {
		http.Error(w, fmt.Sprintf("Failed to update file selection: %s", err), http.StatusBadRequest)
		return
	}

	s.state.Push()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}
