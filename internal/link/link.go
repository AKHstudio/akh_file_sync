package link

import (
	"akh_file_sync/internal/build"
	"akh_file_sync/internal/config"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	junction "github.com/nyaosorg/go-windows-junction"
)

var ErrNotLink = errors.New("not a link")

const PREFIX = "akhsync"

func alreadySynced(linkPath string) bool {
	if _, err := os.Stat(linkPath); errors.Is(err, fs.ErrNotExist) {
		return false
	}

	return true
}

func remove(linkPath string) error {
	if err := os.Remove(linkPath); err != nil {
		return fmt.Errorf("failed to remove %q: %w", linkPath, err)
	}
	return nil
}

func Link(cfg config.Config, opts build.Options) error {
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
	
	bpPath := filepath.Join(cfg.SyncTargetDir, "development_behavior_packs")
	rpPath := filepath.Join(cfg.SyncTargetDir, "development_resource_packs")

	if opts.Only == "all" || opts.Only == "behavior" {
		for _, addon := range opts.Addons {
			target := filepath.Join(cfg.SrcDir, addon, "behavior_packs")
			mountPt := filepath.Join(bpPath, fmt.Sprintf("%s-%s", PREFIX, addon))
			if alreadySynced(mountPt) {
				return fmt.Errorf("has already been synced (%s)", addon)
			}
			
			if err := junction.Create(target, mountPt); err != nil {
				return err
			}
		}
	}
	if opts.Only == "all" || opts.Only == "resource" {
		for _, addon := range opts.Addons {
			target := filepath.Join(cfg.SrcDir, addon, "resource_packs")
			mountPt := filepath.Join(rpPath, fmt.Sprintf("%s-%s", PREFIX, addon))
			if alreadySynced(mountPt) {
				return fmt.Errorf("has already been synced (%s)", addon)
			}
			
			if err := junction.Create(target, mountPt); err != nil {
				return err
			}
		}
	}

	return nil
}

func Unlink(cfg config.Config, opts build.Options) error {
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

	bpPath := filepath.Join(cfg.SyncTargetDir, "development_behavior_packs")
	rpPath := filepath.Join(cfg.SyncTargetDir, "development_resource_packs")

	if opts.Only == "all" || opts.Only == "behavior" {
		for _, addon := range opts.Addons {
			if !alreadySynced(filepath.Join(bpPath, fmt.Sprintf("%s-%s", PREFIX, addon))) {
				return fmt.Errorf("has already been not synced (%s)", addon)
			}

			if err := remove(filepath.Join(bpPath, fmt.Sprintf("%s-%s", PREFIX, addon))); err != nil {
				return err
			}
		}
	}
	if opts.Only == "all" || opts.Only == "resource" {
		for _, addon := range opts.Addons {
			if !alreadySynced(filepath.Join(rpPath, fmt.Sprintf("%s-%s", PREFIX, addon))) {
				return fmt.Errorf("has already been not synced (%s)", addon)
			}

			if err := remove(filepath.Join(rpPath, fmt.Sprintf("%s-%s", PREFIX, addon))); err != nil {
				return err
			}
		}
	}

	return nil
}
