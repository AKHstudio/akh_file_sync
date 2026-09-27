package config

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
)

type fileConfig struct {
	// Path of the directory to be synchronized
	//
	// default: "{userHome}/AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang"
	SyncTargetDir string `json:"syncTargetDir"`
	// Directory name of world
	//
	// default: "world"
	WorldDirName string `json:"worldDirName"`
}

type Config struct {
	fileConfig

	RootDir  string
	SrcDir   string
	BuildDir string
	DistDir  string
	WorldDir string
}

var config Config

func GetConfig() (Config, error) {
	currentDir, err := os.Getwd()
	if err != nil {
		return Config{}, fmt.Errorf("failed to get current directory: %w", err)
	}

	jsonConfig, err := loadConfig(currentDir)
	if err != nil {
		return Config{}, err
	}

	config = Config{
		fileConfig: jsonConfig,
		RootDir:    currentDir,
		SrcDir:     filepath.Join(currentDir, "src"),
		BuildDir:   filepath.Join(currentDir, "build"),
		DistDir:    filepath.Join(currentDir, "dist"),
		WorldDir:   filepath.Join(currentDir, jsonConfig.WorldDirName),
	}

	// check exist src directory
	if _, err := os.Stat(config.SrcDir); errors.Is(err, fs.ErrNotExist) {
		return Config{}, fmt.Errorf("missing src directory: %w", err)
	}

	return config, nil
}
