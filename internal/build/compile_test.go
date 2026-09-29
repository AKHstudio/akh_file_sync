package build

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

func TestCompile_DevMode(t *testing.T) {
	dir := t.TempDir()

	writeFile(t, filepath.Join(dir, "main.ts"), "const x: number = 1; console.log(x);")
	writeFile(t, filepath.Join(dir, "tsconfig.json"), "{}")

	_, err := compile(filepath.Join(dir, "main.ts"), filepath.Join(dir, "main.js"), filepath.Join(dir, "tsconfig.json"), true)
	if err != nil {
		t.Fatal(err)
	}

	assertExists(t, filepath.Join(dir, "main.js"))
	assertExists(t, filepath.Join(dir, "main.js.map"))
}

func TestCompile_ProductMode(t *testing.T) {
	dir := t.TempDir()

	writeFile(t, filepath.Join(dir, "main.ts"), "const x: number = 1; console.log(x);")
	writeFile(t, filepath.Join(dir, "tsconfig.json"), "{}")

	_, err := compile(filepath.Join(dir, "main.ts"), filepath.Join(dir, "main.js"), filepath.Join(dir, "tsconfig.json"), false)
	if err != nil {
		t.Fatal(err)
	}

	assertExists(t, filepath.Join(dir, "main.js"))
	assertNotExists(t, filepath.Join(dir, "main.js.map"))
}

func TestCompile_SyntaxErr(t *testing.T) {
	dir := t.TempDir()

	writeFile(t, filepath.Join(dir, "main.ts"), "const x: number = ;")
	writeFile(t, filepath.Join(dir, "tsconfig.json"), "{}")

	messages, err := compile(filepath.Join(dir, "main.ts"), filepath.Join(dir, "main.js"), filepath.Join(dir, "tsconfig.json"), false)
	if !errors.Is(err, ErrCompileFailed) {
		t.Fatalf("error = %v, want ErrCompileFailed", err)
	}
	if len(messages) == 0 {
		t.Fatal("len(messages) == 0, want compile message")
	}

	if messages[0].Kind != esbuild.ErrorMessage {
		t.Fatal("esbuild message is not error., want esbuild.ErrorMessage")
	}
}

func TestCompile_NotExistTsconfig(t *testing.T) {
	dir := t.TempDir()

	writeFile(t, filepath.Join(dir, "main.ts"), "const x: number = 0; console.log(x)")

	messages, err := compile(filepath.Join(dir, "main.ts"), filepath.Join(dir, "main.js"), filepath.Join(dir, "tsconfig.json"), false)
	if !errors.Is(err, ErrCompileFailed) {
		t.Fatalf("error = %v, want ErrCompileFailed", err)
	}
	if len(messages) == 0 {
		t.Fatal("not error, want err")
	}

	if messages[0].Kind != esbuild.ErrorMessage {
		t.Fatal("esbuild message is not error., want esbuild.ErrorMessage")
	}
	if !strings.Contains(messages[0].Text, "Cannot find tsconfig file") {
		t.Fatalf("not cannot find tsconfig file error, want Cannot find tsconfig file %q", filepath.Join(dir, "tsconfig.json"))
	}
}

func TestCompile_External(t *testing.T) {
	dir := t.TempDir()

	writeFile(t, filepath.Join(dir, "main.ts"), `import { world } from "@minecraft/server"; world.sendMessage("hello")`)
	writeFile(t, filepath.Join(dir, "tsconfig.json"), "{}")

	_, err := compile(filepath.Join(dir, "main.ts"), filepath.Join(dir, "main.js"), filepath.Join(dir, "tsconfig.json"), false)
	if err != nil {
		t.Fatal(err)
	}

	file, err := os.ReadFile(filepath.Join(dir, "main.js"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(file), "@minecraft/server") {
		t.Fatal("not contains external module, want @minecraft/server")
	}
}
