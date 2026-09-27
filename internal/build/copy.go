package build

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
)

var scriptFilePattern = regexp.MustCompile(`(?i)\.(js|ts|mjs|mts|cjs|cts)$`)

func checkAllScriptFile(path string) (bool, error) {
	dirs, err := os.ReadDir(path)
	if err != nil {
		return false, err
	}

	// check all script file
	for _, dir := range dirs {
		if dir.IsDir() {
			isAllScriptFile, err := checkAllScriptFile(filepath.Join(path, dir.Name()))
			if err != nil {
				return false, err
			}
			if !isAllScriptFile {
				return false, nil
			}
			continue
		}
		if ext := filepath.Ext(dir.Name()); !scriptFilePattern.MatchString(ext) {
			return false, nil
		}
	}

	return true, nil
}

func copyPack(srcDir string, distDir string) error {
	// if no exist src, skip copy
	if _, err := os.Stat(srcDir); errors.Is(err, fs.ErrNotExist) {
		return nil
	} else if err != nil {
		return err
	}

	err := filepath.WalkDir(srcDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		rel , err := filepath.Rel(srcDir, path)
		if err != nil {
			return err
		}

		dstPath := filepath.Join(distDir, rel)

		if d.IsDir() {
			isAllScriptFile, err := checkAllScriptFile(path) 
			if err != nil {
				return err
			}
			if isAllScriptFile {
				return filepath.SkipDir
			}

			if err := os.MkdirAll(dstPath, 0o755); err != nil {
				return fmt.Errorf("failed make a directory %s: %w", dstPath, err)
			}
			return nil
		}

		// skip script files
		if ext := filepath.Ext(path); scriptFilePattern.MatchString(ext) {
			return nil
		}

		// ui.Debug("check copyFile pram", "dist", dstPath, "src", path)

		if err := copyFile(dstPath, path); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func copyFile(dst string, src string) error {

	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	distFile, err := os.Create(dst)
	if err != nil {
		return err
	}

	_, err = io.Copy(distFile, srcFile)
	if err := srcFile.Close(); err != nil {
		return err
	}

	if err := distFile.Close(); err != nil {
		return err
	}

	if err != nil {
		return err
	}

	return nil
}
