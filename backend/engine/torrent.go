package engine

import (
	"time"

	"github.com/anacrolix/torrent"
)

type Torrent struct {
	//anacrolix/torrent
	InfoHash   string
	Name       string
	Loaded     bool
	Downloaded int64
	Size       int64
	Files      []*File
	//cloud torrent
	Started      bool
	Dropped      bool
	Percent      float32
	DownloadRate float32
	UploadRate   float32
	Peers        int
	t            *torrent.Torrent
	updatedAt    time.Time
	uploaded     int64
}

type File struct {
	//anacrolix/torrent
	Path      string
	Size      int64
	Chunks    int
	Completed int
	//cloud torrent
	Started  bool
	Percent  float32
	Priority bool // Whether file is selected for download
	f        *torrent.File
}

func (torrent *Torrent) Update(t *torrent.Torrent) {
	torrent.Name = t.Name()
	torrent.Loaded = t.Info() != nil
	if torrent.Loaded {
		torrent.updateLoaded(t)
	}
	torrent.t = t
}

func (torrent *Torrent) updateLoaded(t *torrent.Torrent) {

	torrent.Size = t.Length()
	totalChunks := 0
	totalCompleted := 0
	selectedSize := int64(0)
	selectedDownloaded := int64(0)

	tfiles := t.Files()
	if len(tfiles) > 0 && torrent.Files == nil {
		torrent.Files = make([]*File, len(tfiles))
	}
	//merge in files
	for i, f := range tfiles {
		path := f.Path()
		file := torrent.Files[i]
		if file == nil {
			file = &File{
				Path:     path,
				Priority: true, // Default: all files are selected for download
			}
			torrent.Files[i] = file
		}
		chunks := f.State()

		file.Size = f.Length()
		file.Chunks = len(chunks)
		completed := 0
		for _, p := range chunks {
			if p.Complete {
				completed++
			}
		}
		file.Completed = completed
		file.Percent = percent(int64(file.Completed), int64(file.Chunks))
		file.f = f

		totalChunks += file.Chunks
		totalCompleted += file.Completed

		// Calculate selected files' size and progress
		if file.Priority {
			selectedSize += file.Size
			completedBytes := int64(float64(file.Size) * float64(file.Percent) / 100.0)
			selectedDownloaded += completedBytes
		}
	}

	// Override Size and Downloaded to reflect only selected files
	if selectedSize > 0 {
		torrent.Size = selectedSize
		// Calculate percent based on chunks of selected files only
		selectedChunks := 0
		selectedCompletedChunks := 0
		for _, file := range torrent.Files {
			if file.Priority {
				selectedChunks += file.Chunks
				selectedCompletedChunks += file.Completed
			}
		}
		if selectedChunks > 0 {
			torrent.Percent = percent(int64(selectedCompletedChunks), int64(selectedChunks))
		}
	} else {
		// No files selected, show zero
		torrent.Size = 0
		torrent.Percent = 0
	}

	//cacluate rate
	now := time.Now()
	// Calculate bytes completed only for selected files
	bytesCompleted := int64(0)
	for _, file := range torrent.Files {
		if file != nil && file.Priority && file.f != nil {
			bytesCompleted += file.f.BytesCompleted()
		}
	}

	stats := t.Stats()
	// Upload tracking - BytesWrittenData is not directly accessible, use 0 for now
	uploaded := int64(0)

	// Get peer count
	torrent.Peers = stats.ActivePeers

	if !torrent.updatedAt.IsZero() {
		dt := float32(now.Sub(torrent.updatedAt))

		// Calculate download rate
		db := float32(bytesCompleted - torrent.Downloaded)
		rate := db * (float32(time.Second) / dt)
		if rate >= 0 {
			torrent.DownloadRate = rate
		}

		// Calculate upload rate
		du := float32(uploaded - torrent.uploaded)
		uploadRate := du * (float32(time.Second) / dt)
		if uploadRate >= 0 {
			torrent.UploadRate = uploadRate
		}
	}
	torrent.Downloaded = bytesCompleted
	torrent.uploaded = uploaded
	torrent.updatedAt = now
}

func percent(n, total int64) float32 {
	if total == 0 {
		return float32(0)
	}
	return float32(int(float64(10000)*(float64(n)/float64(total)))) / 100
}
