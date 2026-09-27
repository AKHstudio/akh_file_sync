package main

import (
	"akh_file_sync/internal/cli"
	"akh_file_sync/internal/ui"
	"os"
)

func main() {
	err := cli.Execute()
	if err != nil {
		ui.Error(err.Error())
		os.Exit(1)
	}
}
