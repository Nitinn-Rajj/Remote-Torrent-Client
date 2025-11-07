package engine

import (
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/anacrolix/torrent"
	"github.com/anacrolix/torrent/metainfo"
)

// the Engine Cloud Torrent engine, backed by anacrolix/torrent
type Engine struct {
	mut      sync.Mutex
	cacheDir string
	client   *torrent.Client
	config   Config
	ts       map[string]*Torrent
}

func New() *Engine {
	return &Engine{ts: map[string]*Torrent{}}
}

func (e *Engine) Config() Config {
	return e.config
}

func (e *Engine) Configure(c Config) error {
	//recieve config
	if e.client != nil {
		e.client.Close()
		time.Sleep(1 * time.Second)
	}
	if c.IncomingPort <= 0 {
		return fmt.Errorf("Invalid incoming port (%d)", c.IncomingPort)
	}

	config := torrent.NewDefaultClientConfig()
	config.DataDir = c.DownloadDirectory
	config.NoUpload = !c.EnableUpload
	config.Seed = c.EnableSeeding
	config.ListenPort = c.IncomingPort
	client, err := torrent.NewClient(config)
	if err != nil {
		return err
	}
	e.mut.Lock()
	e.config = c
	e.client = client
	e.mut.Unlock()
	//reset
	e.GetTorrents()
	return nil
}

func (e *Engine) NewMagnet(magnetURI string) error {
	tt, err := e.client.AddMagnet(magnetURI)
	if err != nil {
		return err
	}
	return e.newTorrent(tt)
}

func (e *Engine) NewTorrent(spec *torrent.TorrentSpec) error {
	tt, _, err := e.client.AddTorrentSpec(spec)
	if err != nil {
		return err
	}
	return e.newTorrent(tt)
}

func (e *Engine) newTorrent(tt *torrent.Torrent) error {
	t := e.upsertTorrent(tt)
	go func() {
		<-t.t.GotInfo()
		// Update the torrent to ensure Files array is initialized
		t.Update(tt)
		// Check if AutoStart is enabled in config
		if e.config.AutoStart {
			e.StartTorrent(t.InfoHash)
		}
	}()
	return nil
}

// GetTorrents moves torrents out of the anacrolix/torrent
// and into the local cache
func (e *Engine) GetTorrents() map[string]*Torrent {
	e.mut.Lock()
	defer e.mut.Unlock()

	if e.client == nil {
		return nil
	}
	for _, tt := range e.client.Torrents() {
		e.upsertTorrent(tt)
	}
	return e.ts
}

func (e *Engine) upsertTorrent(tt *torrent.Torrent) *Torrent {
	ih := tt.InfoHash().HexString()
	torrent, ok := e.ts[ih]
	if !ok {
		torrent = &Torrent{InfoHash: ih}
		e.ts[ih] = torrent
	}
	//update torrent fields using underlying torrent
	torrent.Update(tt)
	return torrent
}

func (e *Engine) getTorrent(infohash string) (*Torrent, error) {
	ih, err := str2ih(infohash)
	if err != nil {
		return nil, err
	}
	t, ok := e.ts[ih.HexString()]
	if !ok {
		return t, fmt.Errorf("Missing torrent %x", ih)
	}
	return t, nil
}

func (e *Engine) getOpenTorrent(infohash string) (*Torrent, error) {
	t, err := e.getTorrent(infohash)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (e *Engine) StartTorrent(infohash string) error {
	t, err := e.getOpenTorrent(infohash)
	if err != nil {
		return err
	}

	// Set started flag
	wasStarted := t.Started
	t.Started = true
	for _, f := range t.Files {
		if f != nil {
			f.Started = true
		}
	}

	// Download files based on their priority settings
	if t.t != nil && t.t.Info() != nil {
		for _, f := range t.Files {
			if f != nil && f.f != nil {
				if f.Priority {
					// Download this file
					f.f.Download()
				} else {
					// Don't download this file
					f.f.SetPriority(torrent.PiecePriorityNone)
				}
			}
		}
	}

	// Return error only if trying to start an already actively downloading torrent
	// But allow re-triggering DownloadAll() for torrents that are marked started
	// but not actually downloading
	if wasStarted {
		// Don't return error - we successfully ensured it's downloading
		return nil
	}
	return nil
}

func (e *Engine) StopTorrent(infohash string) error {
	t, err := e.getTorrent(infohash)
	if err != nil {
		return err
	}
	if !t.Started {
		return fmt.Errorf("Already stopped")
	}
	// Don't drop the torrent, just mark it as stopped
	// and cancel all file downloads
	t.Started = false
	for _, f := range t.Files {
		if f != nil {
			f.Started = false
		}
	}
	// Instead of dropping, just cancel downloads but keep the torrent
	if t.t != nil {
		// Cancel all piece requests but don't drop the torrent
		t.t.CancelPieces(0, t.t.NumPieces())
	}
	return nil
}

func (e *Engine) DeleteTorrent(infohash string) error {
	t, err := e.getTorrent(infohash)
	if err != nil {
		return err
	}
	os.Remove(filepath.Join(e.cacheDir, infohash+".torrent"))
	delete(e.ts, t.InfoHash)
	ih, _ := str2ih(infohash)
	if tt, ok := e.client.Torrent(ih); ok {
		tt.Drop()
	}
	return nil
}

func (e *Engine) StartFile(infohash, filepath string) error {
	t, err := e.getOpenTorrent(infohash)
	if err != nil {
		return err
	}
	var f *File
	for _, file := range t.Files {
		if file.Path == filepath {
			f = file
			break
		}
	}
	if f == nil {
		return fmt.Errorf("Missing file %s", filepath)
	}
	if f.Started {
		return fmt.Errorf("Already started")
	}
	t.Started = true
	f.Started = true
	return nil
}

func (e *Engine) StopFile(infohash, filepath string) error {
	return fmt.Errorf("Unsupported")
}

// GetTorrentFiles returns detailed file information for a specific torrent
func (e *Engine) GetTorrentFiles(infohash string) (*Torrent, error) {
	e.mut.Lock()
	defer e.mut.Unlock()

	t, ok := e.ts[infohash]
	if !ok {
		return nil, fmt.Errorf("Torrent not found")
	}

	if !t.Loaded {
		return nil, fmt.Errorf("Torrent metadata not loaded yet")
	}

	return t, nil
}

// UpdateFileSelection updates which files should be downloaded
func (e *Engine) UpdateFileSelection(infohash string, filePaths []string, download bool) error {
	e.mut.Lock()
	defer e.mut.Unlock()

	t, ok := e.ts[infohash]
	if !ok {
		return fmt.Errorf("Torrent not found")
	}

	if !t.Loaded {
		return fmt.Errorf("Torrent metadata not loaded yet")
	}

	// Create a map for quick lookup
	filePathMap := make(map[string]bool)
	for _, path := range filePaths {
		filePathMap[path] = true
	}

	// Update priority for matching files
	for _, file := range t.Files {
		if filePathMap[file.Path] {
			file.Priority = download

			// Update the actual torrent file priority
			if file.f != nil {
				if download {
					file.f.Download()
				} else {
					file.f.SetPriority(torrent.PiecePriorityNone)
				}
			}
		}
	}

	return nil
}

// SetFilePriority sets the download priority for a single file
func (e *Engine) SetFilePriority(infohash string, filePath string, download bool) error {
	return e.UpdateFileSelection(infohash, []string{filePath}, download)
}

func str2ih(str string) (metainfo.Hash, error) {
	var ih metainfo.Hash
	e, err := hex.Decode(ih[:], []byte(str))
	if err != nil {
		return ih, fmt.Errorf("Invalid hex string")
	}
	if e != 20 {
		return ih, fmt.Errorf("Invalid length")
	}
	return ih, nil
}
