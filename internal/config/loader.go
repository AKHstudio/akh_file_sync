package config

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
)

var oldConfigFiles = []string{"akhsync.config.ts", "akhsync.config.mts", "akhsync.config.js", "akhsync.config.mjs", "akhsync.config.cjs"}
var configFile = "akhsync.config.json"

func searchConfigFile(currentDir string) (string, error) {
	path := filepath.Join(currentDir, configFile)
	if _, err := os.Stat(path); err == nil {
		return path, nil
	} else if !errors.Is(err, fs.ErrNotExist) {
		return "", fmt.Errorf("failed to check %s: %w", configFile, err)
	}

	for _, oldConfigFile := range oldConfigFiles {
		path = filepath.Join(currentDir, oldConfigFile)
		if _, err := os.Stat(path); err == nil {
			return "", fmt.Errorf("found %q is old config filename. Please use new config: %s", path, configFile)
		} else if !errors.Is(err, fs.ErrNotExist) {
			return "", fmt.Errorf("failed to check %s: %w", oldConfigFile, err)
		}
	}

	return "", nil
}

func loadConfig(currentDir string) (fileConfig, error) {
	appDataPath, err := os.UserConfigDir()
	if err != nil {
		return fileConfig{}, err
	}

	defaultConfig := fileConfig{
		SyncTargetDir: filepath.Join(appDataPath, "Minecraft Bedrock", "Users", "Shared", "games", "com.mojang"),
		WorldDirName:  "world",
	}

	configPath, err := searchConfigFile(currentDir)
	if err != nil {
		return fileConfig{}, err
	}

	if configPath != "" {
		data, err := os.ReadFile(configPath)
		if err != nil {
			return fileConfig{}, fmt.Errorf("failed read file %s: %w", configPath, err)
		}

		var configJSON struct {
			Schema string `json:"$schema"`
			fileConfig
		}
		configJSON.fileConfig = defaultConfig

		dec := json.NewDecoder(bytes.NewReader(data))
		dec.DisallowUnknownFields()
		if err := dec.Decode(&configJSON); err != nil {
			return fileConfig{}, fmt.Errorf("failed to parse %s: %w", configPath, err)
		}
		// check json formant
		if err := dec.Decode(&json.RawMessage{}); !errors.Is(err, io.EOF) {
			return fileConfig{}, fmt.Errorf("failed to parse %s: unexpected data after the JSON object", configFile)
		}
		return configJSON.fileConfig, nil
	}

	return defaultConfig, nil
}
