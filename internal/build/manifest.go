package build

import (
	"akh_file_sync/internal/config"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

type ManifestEntry struct {
	Modules []struct {
		Type  string `json:"type"`
		Entry string `json:"entry"`
	} `json:"modules"`
}

var extCandidates = []string{
	".ts", ".mts", ".cts", ".js", ".mjs", ".cjs",
}


const MANIFEST_FILE = "manifest.json"

func getManifestEntryPath(cfg config.Config , packDir string) (string, error) {
	path := filepath.Join(cfg.SrcDir, packDir, "behavior_packs", MANIFEST_FILE)

	if info, err := os.Stat(path); err != nil || info.IsDir() {
		return "", fmt.Errorf("missing to manifest json %s: %w", path, err)
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("failed read file %s: %w", path, err)
	}

	var manifestEntry ManifestEntry
	if err = json.Unmarshal(data, &manifestEntry); err != nil {
		return "", fmt.Errorf("failed to json parse %s: %w", path, err)
	}

	if len(manifestEntry.Modules) == 0 {
		return "", fmt.Errorf("manifest in %s has no modules", path)
	}

	for _, module := range manifestEntry.Modules {
		if module.Type == "script" {
			entryPath := filepath.Join(cfg.SrcDir, packDir, "behavior_packs", module.Entry)
			
			for _, ext := range extCandidates {
				newEntryPath := strings.TrimSuffix(entryPath, filepath.Ext(entryPath)) + ext	
				if _, err := os.Stat(newEntryPath); err == nil { 
					return newEntryPath, nil
				} else if !errors.Is(err, fs.ErrNotExist) {
					return "", err
				}
			}
		}
	}

	return "", nil
}
