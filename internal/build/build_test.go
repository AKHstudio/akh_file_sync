package build

import (
	"akh_file_sync/internal/config"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func newTestConfig(t *testing.T) config.Config {
	t.Helper()
	root := t.TempDir()
	cfg := config.Config{
		RootDir:  root,
		SrcDir:   filepath.Join(root, "src"),
		BuildDir: filepath.Join(root, "build"),
	}

	// create src dir
	if err := os.MkdirAll(cfg.SrcDir, 0o755); err != nil {
		t.Fatalf("failed make a src directory: %v", err)
	}

	return cfg
}

func TestBuildRun_ErrCase(t *testing.T) {
	tests := []struct {
		name       string
		setup      func(t *testing.T, cfg config.Config) Options
		containErr string
	}{
		{
			name: "not exist src directory",
			setup: func(t *testing.T, cfg config.Config) Options {
				if err := os.Remove(cfg.SrcDir); err != nil {
					t.Fatalf("failed remove a src directory: %v", err)
				}

				return Options{
					Addons:      []string{},
					Development: false,
					Only:        "all",
				}
			},
		},
		{
			name: "src directory is empty",
			setup: func(t *testing.T, cfg config.Config) Options {
				return Options{
					Addons:      []string{},
					Development: false,
					Only:        "all",
				}
			},
			containErr: "not found addon",
		},
		{
			name: "fraud only",
			setup: func(t *testing.T, cfg config.Config) Options {
				if err := os.MkdirAll(filepath.Join(cfg.SrcDir, "addon"), 0o755); err != nil {
					t.Fatalf("failed make a addon directory: %v", err)
				}

				return Options{
					Addons:      []string{"addon"},
					Development: false,
					Only:        "foo",
				}
			},
			containErr: "failed only mapping",
		},
		{
			name: "only is empty",
			setup: func(t *testing.T, cfg config.Config) Options {
				if err := os.MkdirAll(filepath.Join(cfg.SrcDir, "addon"), 0o755); err != nil {
					t.Fatalf("failed make a addon directory: %v", err)
				}

				return Options{
					Addons:      []string{"addon"},
					Development: false,
					Only:        "",
				}
			},
			containErr: "failed only mapping",
		},
		{
			name: "addons contain path",
			setup: func(t *testing.T, cfg config.Config) Options {
				return Options{
					Addons:      []string{"../addon"},
					Development: false,
					Only:        "all",
				}
			},
			containErr: "invalid addon name",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cfg := newTestConfig(t)
			opts := tt.setup(t, cfg)

			err := Run(cfg, opts)
			if err == nil {
				t.Fatalf("error = nil, want error")
			}
			if tt.containErr != "" {
				if !strings.Contains(err.Error(), tt.containErr) {
					t.Errorf("error = %v, want contains %s", err, tt.containErr)
				}
			}
		})
	}
}

func TestBuildRun_NormalResource(t *testing.T) {
	opts := Options{
		Addons:      []string{"addon"},
		Development: false,
		Only:        "resource",
	}

	cfg := newTestConfig(t)
	srcResourcePath := filepath.Join(cfg.SrcDir, "addon", "resource_packs")
	dstResourcePath := filepath.Join(cfg.BuildDir, "addon", "resource_packs")

	writeFile(t, filepath.Join(srcResourcePath, "manifest.json"), "")
	writeFile(t, filepath.Join(srcResourcePath, "textures", "a.png"), "")

	if err := Run(cfg, opts); err != nil {
		t.Fatal(err)
	}

	assertExists(t, filepath.Join(dstResourcePath, "manifest.json"))
	assertExists(t, filepath.Join(dstResourcePath, "textures", "a.png"))
}

func TestBuildRun_NormalBehavior(t *testing.T) {
	opts := Options{
		Addons:      []string{"addon"},
		Development: true,
		Only:        "behavior",
	}

	cfg := newTestConfig(t)
	srcBehaviorPath := filepath.Join(cfg.SrcDir, "addon", "behavior_packs")
	dstBehaviorPath := filepath.Join(cfg.BuildDir, "addon", "behavior_packs")

	writeFile(t, filepath.Join(srcBehaviorPath, "manifest.json"), `{"modules":[{"type":"script","entry":"scripts/main.js"}]}`)
	writeFile(t, filepath.Join(srcBehaviorPath, "scripts", "main.ts"), `import { world } from "@minecraft/server"; world.sendMessage("hello");`)
	writeFile(t, filepath.Join(cfg.RootDir, "tsconfig.json"), `{}`)

	if err := Run(cfg, opts); err != nil {
		t.Fatal(err)
	}

	assertExists(t, filepath.Join(dstBehaviorPath, "manifest.json"))
	assertExists(t, filepath.Join(dstBehaviorPath, "scripts", "main.js"))
	assertExists(t, filepath.Join(dstBehaviorPath, "scripts", "main.js.map"))
	assertNotExists(t, filepath.Join(dstBehaviorPath, "scripts", "main.ts"))
}

func TestBuildRun_NotSelectAddon(t *testing.T) {
	opts := Options{
		Addons:      []string{},
		Development: false,
		Only:        "resource",
	}

	cfg := newTestConfig(t)
	srcResourcePath := filepath.Join(cfg.SrcDir, "addon", "resource_packs")
	dstResourcePath := filepath.Join(cfg.BuildDir, "addon", "resource_packs")

	writeFile(t, filepath.Join(srcResourcePath, "manifest.json"), "")
	writeFile(t, filepath.Join(srcResourcePath, "textures", "a.png"), "")

	if err := Run(cfg, opts); err != nil {
		t.Fatal(err)
	}

	assertExists(t, filepath.Join(dstResourcePath, "manifest.json"))
	assertExists(t, filepath.Join(dstResourcePath, "textures", "a.png"))
}

func TestBuildRun_NotTouchBehavior(t *testing.T) {
	opts := Options{
		Addons:      []string{"addon"},
		Development: false,
		Only:        "resource",
	}

	cfg := newTestConfig(t)
	srcResourcePath := filepath.Join(cfg.SrcDir, "addon", "resource_packs")
	srcBehaviorPath := filepath.Join(cfg.SrcDir, "addon", "behavior_packs")
	dstResourcePath := filepath.Join(cfg.BuildDir, "addon", "resource_packs")
	dstBehaviorPath := filepath.Join(cfg.BuildDir, "addon", "behavior_packs")

	writeFile(t, filepath.Join(srcResourcePath, "manifest.json"), "")
	writeFile(t, filepath.Join(srcResourcePath, "textures", "a.png"), "")

	writeFile(t, filepath.Join(srcBehaviorPath, "manifest.json"), "")

	if err := Run(cfg, opts); err != nil {
		t.Fatal(err)
	}

	assertExists(t, filepath.Join(dstResourcePath, "manifest.json"))
	assertExists(t, filepath.Join(dstResourcePath, "textures", "a.png"))

	assertNotExists(t, dstBehaviorPath)
}

func TestBuildRun_RemoveOldBuild(t *testing.T) {
	opts := Options{
		Addons:      []string{"addon"},
		Development: false,
		Only:        "resource",
	}

	cfg := newTestConfig(t)
	srcResourcePath := filepath.Join(cfg.SrcDir, "addon", "resource_packs")

	writeFile(t, filepath.Join(srcResourcePath, "manifest.json"), "")
	writeFile(t, filepath.Join(cfg.BuildDir, "addon", "stale.txt"), "")

	if err := Run(cfg, opts); err != nil {
		t.Fatal(err)
	}

	assertNotExists(t, filepath.Join(cfg.BuildDir, "addon", "stale.txt"))
}

func TestBuildRun_FilterAddon(t *testing.T) {
	opts := Options{
		Addons:      []string{"a1"},
		Development: false,
		Only:        "resource",
	}

	cfg := newTestConfig(t)

	writeFile(t, filepath.Join(cfg.SrcDir, "a1", "resource_packs", "manifest.json"), "")
	writeFile(t, filepath.Join(cfg.SrcDir, "a2", "resource_packs", "manifest.json"), "")

	if err := Run(cfg, opts); err != nil {
		t.Fatal(err)
	}

	assertExists(t, filepath.Join(cfg.BuildDir, "a1", "resource_packs", "manifest.json"))
	assertNotExists(t, filepath.Join(cfg.BuildDir, "a2"))
}

func TestBuildRun_ToSkipNoExist(t *testing.T) {
	opts := Options{
		Addons:      []string{"addon"},
		Development: false,
		Only:        "behavior",
	}

	cfg := newTestConfig(t)

	writeFile(t, filepath.Join(cfg.SrcDir, "addon", "resource_packs", "manifest.json"), "")

	if err := Run(cfg, opts); err != nil {
		t.Fatal(err)
	}
}
