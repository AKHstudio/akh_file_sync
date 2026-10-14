package addon

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
)

const ADDON_BASE_FILE_NAME = "manifest.json"

var addonTypeMap = map[string][]string{
	"behavior_packs": {"data", "script"},
	"resource_packs": {"resources"},
}

type Addon struct {
	Name     string
	Behavior struct {
		Has        bool
		HasScripts bool
		PackPath   string
	}
	Resource struct {
		Has      bool
		PackPath string
	}
}

func findAddonDirs(targetPath string) ([]string, error) {
	var foundDirs []string

	entries, err := os.ReadDir(targetPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read directory %q: %w", targetPath, err)
	}
	// check exist manifest.json
	for _, e := range entries {
		if !e.IsDir() && e.Name() == ADDON_BASE_FILE_NAME {
			foundDirs := append(foundDirs, targetPath)
			return foundDirs, nil
		}
	}

	// if not exist manifest.json
	for _, e := range entries {
		if e.IsDir() {
			subPath := filepath.Join(targetPath, e.Name())
			subFound, err := findAddonDirs(subPath)
			if err != nil {
				return nil, err
			}
			foundDirs = append(foundDirs, subFound...)
		}
	}

	return foundDirs, nil
}

func SearchAddons(rootPath string) ([]Addon, error) {
	if info, err := os.Stat(rootPath); errors.Is(err, fs.ErrNotExist) {
		return nil, fmt.Errorf("%q is missing: %w", rootPath, err)
	} else if err != nil {
		return nil, err
	} else if !info.IsDir() {
		return nil, fmt.Errorf("%q is not a directory", rootPath)
	}

	addonDirs, err := findAddonDirs(rootPath)
	if err != nil {
		return nil, err
	}
	if len(addonDirs) == 0 {
		return nil, fmt.Errorf("missing addon directory %q", rootPath)
	}

	var addons []Addon
	for _, a := range addonDirs {
		dirs, err := os.ReadDir(a)
		if err != nil {
			return nil, fmt.Errorf("failed to read directory %q: %w", a, err)
		}
		for _, d := range dirs {
			// if !d.IsDir() && d.Name() == ADDON_BASE_FILE_NAME {
			// 	manifestPath := filepath.Join(a, d.Name())
			// 	manifest, err := LoadManifest(manifestPath)
			// 	if err != nil {
			// 		return nil, err
			// 	}
			// 	// name 
			// 	addonName := manifest.Header.Name
			// 	if len(addonName) == 0 {
			// 		return nil, fmt.Errorf("missing addon name from manifest %q", manifestPath)
			// 	}
			// 	// behavior
			// }
		}
	}


	return nil, nil
}
