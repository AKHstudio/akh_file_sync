package build

import (
	"akh_file_sync/internal/config"
	"akh_file_sync/internal/ui"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

type Options struct {
	Addons      []string // 空なら src 直下の全部
	Development bool
	Only        string // "behavior" / "resource" / "all"
}

var onlyMap = map[string][]string{
	"behavior": {"behavior_packs"},
	"resource": {"resource_packs"},
	"all":      {"behavior_packs", "resource_packs"},
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
	// check only option
	processes, ok := onlyMap[opts.Only]
	if !ok {
		return fmt.Errorf("failed only mapping. %s", opts.Only)
	}

	// remove old build
	for _, addon := range opts.Addons {
		if addon != filepath.Base(addon) || addon == "." || addon == ".." {
			return fmt.Errorf("invalid addon name: %q", addon)
		}
		err := os.RemoveAll(filepath.Join(cfg.BuildDir, filepath.Base(addon)))
		if err != nil {
			return err
		}

		for _, only := range processes {
			ui.Debug("check copyPack pram", "src", filepath.Join(cfg.SrcDir, filepath.Base(addon), only), "dist", filepath.Join(cfg.BuildDir, filepath.Base(addon), only))

			addonSrc := filepath.Join(cfg.SrcDir, filepath.Base(addon), only)
			addonDst := filepath.Join(cfg.BuildDir, filepath.Base(addon), only)

			// check addonSrc
			if _, err := os.Stat(addonSrc); errors.Is(err, fs.ErrNotExist) {
				continue // if it does not exist, go to the next pack
			} else if err != nil {
				return err
			}

			err := copyPack(
				addonSrc,
				addonDst,
			)
			if err != nil {
				return err
			}

			if only == "behavior_packs" {
				entry, err := getManifestEntryPath(cfg, filepath.Base(addon))
				if err != nil {
					return err
				}
				if entry == "" {
					continue
				}

				outputFile := strings.TrimSuffix(entry, filepath.Ext(entry)) + ".js"
				rel, err := filepath.Rel(cfg.SrcDir, outputFile)
				if err != nil {
					return err
				}
				messages, err := compile(entry, filepath.Join(cfg.BuildDir, rel), filepath.Join(cfg.RootDir, "tsconfig.json"), opts.Development)
				for _, message := range messages {
					if message.Kind == esbuild.WarningMessage {
						ui.Warn(message.Text)
					} else {
						ui.Error(message.Text)
					}
				}
				if err != nil {
					return err
				}
			}
		}
	}

	return nil
}
