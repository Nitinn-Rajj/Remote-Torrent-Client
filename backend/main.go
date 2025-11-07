package main

import (
	"log"

	"github.com/jpillora/cloud-torrent/server"
	"github.com/jpillora/opts"
)

var version = "1.0.0" //set with ldflags

func main() {
	s := server.Server{
		Title:      "Remote Torrent",
		Port:       3000,
		ConfigPath: "remote-torrent.json",
	}

	o := opts.New(&s)
	o.Version(version)
	o.PkgRepo()
	o.SetLineWidth(96)
	o.Parse()

	log.Printf("Starting Remote Torrent Server on port %d...", s.Port)
	if err := s.Run(version); err != nil {
		log.Fatal(err)
	}
}
