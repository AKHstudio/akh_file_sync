package build

import (
	"akh_file_sync/internal/config"
	"errors"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestGetManifestEntryPath(t *testing.T) {
	tests := []struct {
		name    string
		setup   func(t *testing.T, bpDir string)
		want    string
		wantErr bool
	}{
		{
			name:    "not exists manifest",
			setup:   func(t *testing.T, bpDir string) {},
			wantErr: true,
		},
		{
			name: "broken json",
			setup: func(t *testing.T, bpDir string) {
				writeFile(t, filepath.Join(bpDir, MANIFEST_FILE), `{broken`)
			},
			wantErr: true,
		},
		{
			name: "empty modules",
			setup: func(t *testing.T, bpDir string) {
				writeFile(t, filepath.Join(bpDir, MANIFEST_FILE), `{"modules":[]}`)
			},
			wantErr: true,
		},
		{
			name: "not a script module",
			setup: func(t *testing.T, bpDir string) {
				writeFile(t, filepath.Join(bpDir, MANIFEST_FILE), `{"modules":[{"type":"data"}]}`)
			},
			want:    "",
			wantErr: false,
		},
		{
			name: "exist script module and entry file",
			setup: func(t *testing.T, bpDir string) {
				writeFile(t, filepath.Join(bpDir, MANIFEST_FILE), `{"modules":[{"type":"data"}, {"type":"script","entry":"scripts/main.js"}]}`)
				writeFile(t, filepath.Join(bpDir, "scripts", "main.js"), "//test")
			},
			want:    "scripts/main.js",
			wantErr: false,
		},
		{
			name: "exist script module and change ext entry file",
			setup: func(t *testing.T, bpDir string) {
				writeFile(t, filepath.Join(bpDir, MANIFEST_FILE), `{"modules":[{"type":"data"}, {"type":"script","entry":"scripts/main.js"}]}`)
				writeFile(t, filepath.Join(bpDir, "scripts", "main.ts"), "//test")
			},
			want:    "scripts/main.ts",
			wantErr: false,
		},
		{
			name: "priority ts",
			setup: func(t *testing.T, bpDir string) {
				writeFile(t, filepath.Join(bpDir, MANIFEST_FILE), `{"modules":[{"type":"data"}, {"type":"script","entry":"scripts/main.js"}]}`)
				writeFile(t, filepath.Join(bpDir, "scripts", "main.js"), "//test")
				writeFile(t, filepath.Join(bpDir, "scripts", "main.ts"), "//test")
			},
			want:    "scripts/main.ts",
			wantErr: false,
		},
		{
			name: "not exist entry file",
			setup: func(t *testing.T, bpDir string) {
				writeFile(t, filepath.Join(bpDir, MANIFEST_FILE), `{"modules":[{"type":"data"}, {"type":"script","entry":"scripts/main.js"}]}`)
			},
			want:    "",
			wantErr: false,
		},
		{
			name: "manifest.json is directory",
			setup: func(t *testing.T, bpDir string) {
				if err := os.MkdirAll(filepath.Join(bpDir, MANIFEST_FILE), 0o755); err != nil {
					t.Fatal(err)
				}
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			root := t.TempDir()
			cfg := config.Config{
				RootDir:  root,
				SrcDir:   filepath.Join(root, "src"),
				BuildDir: filepath.Join(root, "build"),
			}

			packDir := "addon"
			bpDir := filepath.Join(cfg.SrcDir, packDir, "behavior_packs")
			tt.setup(t, bpDir)

			got, err := getManifestEntryPath(cfg, packDir)
			if (err != nil) != tt.wantErr {
				t.Fatalf("getManifestEntryPath(cfg, packDir) error = %v, wantErr %t", err, tt.wantErr)
			}
			if err != nil && strings.Contains(err.Error(), "%!") {
				t.Errorf("error message has bad format verb: %v", err)
			}
			if tt.want == "" {
				if got != tt.want {
					t.Errorf("getManifestEntryPath(cfg, packDir) = %q, want %q", got, tt.want)
				}
			} else {
				if got != filepath.Join(bpDir, tt.want) {
					t.Errorf("getManifestEntryPath(cfg, packDir) = %q, want %q", got, filepath.Join(bpDir, tt.want))
				}
			}
		})
	}
}

func TestGetManifestEntryPath_StatError(t *testing.T) {
	// os.Stat が ErrNotExist 以外のエラーを返しても panic しないこと。
	// パスに NUL 文字を含めると、OS を問わず os.Stat は "invalid argument" を返す。
	root := t.TempDir()
	cfg := config.Config{
		RootDir:  root,
		SrcDir:   filepath.Join(root, "src"),
		BuildDir: filepath.Join(root, "build"),
	}

	packDir := "a\x00b"

	if _, err := getManifestEntryPath(cfg, packDir); err == nil {
		t.Fatal("error = nil, want error")
	}
}

func TestGetManifestEntryPath_MissingManifest(t *testing.T) {
	root := t.TempDir()
	cfg := config.Config{
		RootDir:  root,
		SrcDir:   filepath.Join(root, "src"),
		BuildDir: filepath.Join(root, "build"),
	}

	packDir := "addon"

	if _, err := getManifestEntryPath(cfg, packDir); !errors.Is(err, fs.ErrNotExist) {
		t.Errorf("error = %v, want fs.ErrNotExist", err)
	}
}
