package dist

import (
	"akh_file_sync/internal/config"
	"archive/zip"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"slices"
)

type Options struct {
	Addons       []string // 空なら src 直下の全部
	SetVersion   string
	Type         []string
	SetWorldName string
}

func exist(path string) bool {
	if _, err := os.Stat(path); err == nil {
		return true
	} else if errors.Is(err, fs.ErrNotExist) {
		return false
	} else {
		panic(err)
	}
}

func archive(zipWriter *zip.Writer, sourceRootPath string, cfg config.Config) error {
	return filepath.WalkDir(sourceRootPath, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() {
			return nil
		}

		relPath, err := filepath.Rel(cfg.BuildDir, path)
		if err != nil {
			return err
		}

		zipPath := filepath.ToSlash(relPath)

		w, err := zipWriter.Create(zipPath)
		if err != nil {
			return err
		}

		f, err := os.Open(path)
		if err != nil {
			return err
		}
		defer f.Close()

		_, err = io.Copy(w, f)
		if err != nil {
			return err
		}

		return nil
	})
}

func Run(cfg config.Config, opts Options) error {
	if len(opts.Addons) == 0 {
		dirs, err := os.ReadDir(cfg.SrcDir)
		if err != nil {
			return err
		}

		for _, dir := range dirs {
			if dir.IsDir() {
				opts.Addons = append(opts.Addons, dir.Name())
			}
		}
	}
	if len(opts.Addons) == 0 {
		return errors.New("not found addon in src directory")
	}

	// remove old dist
	if err := os.RemoveAll(cfg.DistDir); err != nil {
		return fmt.Errorf("failed to remove old dist %q: %w", cfg.DistDir, err)
	}
	// create new dist
	if err := os.MkdirAll(cfg.DistDir, 0o755); err != nil {
		return fmt.Errorf("failed to make a directory %q: %w", cfg.DistDir, err)
	}

	if slices.Contains(opts.Type, "addon") {
		zipFilePath := filepath.Join(cfg.DistDir, fmt.Sprintf("%s-%s.zip", filepath.Base(cfg.RootDir), opts.SetVersion))
		zipFile, err := os.Create(zipFilePath)
		if err != nil {
			return fmt.Errorf("failed to create %q: %w", zipFilePath, err)
		}
		defer zipFile.Close()

		zipWriter := zip.NewWriter(zipFile)
		defer zipWriter.Close()

		for _, addon := range opts.Addons {
			targetBP := filepath.Join(cfg.BuildDir, addon, "behavior_packs")
			targetRP := filepath.Join(cfg.BuildDir, addon, "resource_packs")
			if exist(targetBP) {
				err := archive(zipWriter, targetBP, cfg)
				if err != nil {
					return err
				}
			}
			if exist(targetRP) {
				err := archive(zipWriter, targetRP, cfg)
				if err != nil {
					return err
				}
			}
		}
	}

	if slices.Contains(opts.Type, "world") {
		//TODO
	}

	return nil
}
