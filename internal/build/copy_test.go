package build

import (
	"errors"
	"io/fs"
	"os"
	"path/filepath"
	"testing"
)

func writeFile(t *testing.T, path, context string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(context), 0o644); err != nil {
		t.Fatal(err)
	}
}

func assertExists(t *testing.T, path string) {
	t.Helper()
	if _, err := os.Stat(path); err == nil {
		return
	} else if errors.Is(err, fs.ErrNotExist) {
		t.Errorf("os.Stat(%q) = %v, want nil", path, err)
	} else {
		t.Fatal(err)
	}
}

func assertNotExists(t *testing.T, path string) {
	t.Helper()
	if _, err := os.Stat(path); err == nil {
		t.Errorf("%q exists, want not exist", path)
	} else if errors.Is(err, fs.ErrNotExist) {
		return
	} else {
		t.Fatal(err)
	}
}

func assertFileContent(t *testing.T, path, want string) {
	t.Helper()
	file, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}

	if string(file) != want {
		t.Errorf("file content = %q, want %q", string(file), want)
	}
}

func TestScriptFilePattern(t *testing.T) {
	tests := []struct {
		name string
		ext  string
		want bool
	}{
		{name: "js", ext: ".js", want: true},
		{name: "ts", ext: ".ts", want: true},
		{name: "mjs", ext: ".mjs", want: true},
		{name: "mts", ext: ".mts", want: true},
		{name: "cjs", ext: ".cjs", want: true},
		{name: "cts", ext: ".cts", want: true},
		{name: "TS", ext: ".TS", want: true},
		{name: "json", ext: ".json", want: false},
		{name: "png", ext: ".png", want: false},
		{name: "tsx", ext: ".tsx", want: false},
		{name: `no extension`, ext: "", want: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := scriptFilePattern.MatchString(tt.ext)
			if got != tt.want {
				t.Errorf("scriptFilePattern.MatchString(%q) = %t, want %t", tt.ext, got, tt.want)
			}
		})
	}
}

func TestCheckAllScriptFile(t *testing.T) {
	tests := []struct {
		name  string
		files []string
		want  bool
	}{
		{name: "all", files: []string{"main.ts", "util.js"}, want: true},
		{name: "mix", files: []string{"main.ts", "data.json"}, want: false},
		{name: "all sub", files: []string{"main.ts", "lib/a.ts", "lib/b.mjs"}, want: true},
		{name: "mix sub", files: []string{"main.ts", "lib/a.ts", "lib/readme.md"}, want: false},
		{name: "empty", files: []string{}, want: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			dir := t.TempDir()

			// create temp files
			for _, file := range tt.files {
				writeFile(t, filepath.Join(dir, file), "//test")
			}

			got, err := checkAllScriptFile(dir)
			if err != nil {
				t.Fatalf("checkAllScriptFile() error = %v", err)
			}

			if got != tt.want {
				t.Errorf("checkAllScriptFile(files=%v) = %t, want %t", tt.files, got, tt.want)
			}
		})

	}
}

func TestCheckAllScriptFile_NotExist(t *testing.T) {
	dir := t.TempDir()
	notExist := filepath.Join(dir, "empty")
	if _, err := checkAllScriptFile(notExist); err == nil {
		t.Fatalf("checkAllScriptFile(%q) = %v, want an error", notExist, err)
	}
}

func TestCopyPack(t *testing.T) {
	dir := t.TempDir()
	srcPath := filepath.Join(dir, "src")
	dstPath := filepath.Join(dir, "build")

	files := []struct {
		name      string
		content   string
		wantExist bool
	}{
		{name: "manifest.json", content: `{"name":"test"}`, wantExist: true},
		{name: "scripts/main.ts", content: "import { world } from \"@minecraft/server\"", wantExist: false},
		{name: "scripts/main.md", content: "main.ts", wantExist: true},
		{name: "scripts/util/a.ts", content: "//TODO", wantExist: false},
		{name: "scripts/util/b.ts", content: `console.log("hello")`, wantExist: false},
		{name: "docs/README.md", content: "# What is this??", wantExist: true},
	}

	// write file
	for _, file := range files {
		writeFile(t, filepath.Join(srcPath, file.name), file.content)
	}
	// add empty dir
	if err := os.MkdirAll(filepath.Join(srcPath, "empty"), 0o755); err != nil {
		t.Fatal(err)
	}

	// copyPack
	if err := copyPack(srcPath, dstPath); err != nil {
		t.Fatal(err)
	}

	// check files
	for _, file := range files {
		copiedPath := filepath.Join(dstPath, file.name)
		if file.wantExist {
			assertExists(t, copiedPath)
			assertFileContent(t, copiedPath, file.content)
		} else {
			assertNotExists(t, copiedPath)
		}
	}

	// check dirs
	for _, d := range []string{"scripts/util", "empty"} {
		assertNotExists(t, filepath.Join(dstPath, d))
	}
}

func TestCopyPack_SrcNotExist(t *testing.T) {
	dir := t.TempDir()
	srcPath := filepath.Join(dir, "src")
	dstPath := filepath.Join(dir, "build")

	err := copyPack(srcPath, dstPath)
	if err != nil {
		t.Fatalf("copyPack(srcPath, dstPath) = %v, want nil", err)
	}

	assertNotExists(t, dstPath)
}
