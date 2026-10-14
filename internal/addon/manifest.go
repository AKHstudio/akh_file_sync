package addon

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// load manifest
func LoadManifest(manifestPath string) (Manifest, error) {
	fullPath, err := filepath.Abs(manifestPath)
	if err != nil {
		return Manifest{}, fmt.Errorf("failed to resolve the file path: %w", err)
	}
	file, err := os.ReadFile(fullPath)
	if err != nil {
		return Manifest{},fmt.Errorf("failed to read file %q: %w", fullPath, err)
	}
	var manifest Manifest
	if err := json.Unmarshal(file, &manifest); err != nil {
		return Manifest{},fmt.Errorf("failed to parse manifest file %q: %w", fullPath, err)
	}

	return manifest, nil
}



// Manifest は manifest.json (format_version: 3) のルート。
// header 以外 (modules, dependencies など) は header の中ではなくルート直下にある点に注意。
type Manifest struct {
	// The syntax version used in the manifest file. In this section, it is version 3.
	FormatVersion int `json:"format_version"`
	// External information about the pack.
	Header Header `json:"header"`
	// Describes modules which are content types that the pack may contain.
	Modules []Module `json:"modules,omitempty"`
	// Describes external dependencies that the pack requires (another pack or a script module).
	Dependencies []Dependency `json:"dependencies,omitempty"`
	// Optional features that can be enabled.
	// e.g. "chemistry", "editorExtension", "script_eval", "raytraced", "pbr"
	Capabilities []string `json:"capabilities,omitempty"`
	// Metadata on the pack, currently mandatory in this version.
	Metadata *Metadata `json:"metadata,omitempty"`
	// Only for resource pack. Sub-packs that can be enabled and disabled individually.
	Subpacks []Subpack `json:"subpacks,omitempty"`
	// Order-dependent list of settings the player can modify in the game's UI.
	Settings []Setting `json:"settings,omitempty"`
}

type Header struct {
	// Specific to world templates. Whether a random seed should be generated on world creation.
	AllowRandomSeed bool `json:"allow_random_seed,omitempty"`
	// Specific to world templates. "A.B.C" version of the vanilla packs to apply.
	BaseGameVersion string `json:"base_game_version,omitempty"`
	// A description of the pack. Can be text or a translation key.
	Description string `json:"description,omitempty"`
	// Only for skin and behaviour packs. Locks the pack from being used as a global pack.
	PlatformLocked bool `json:"platform_locked,omitempty"`
	// Specific to world templates. If enabled, the player can not modify the world options.
	LockTemplateOptions bool `json:"lock_template_options,omitempty"`
	// "A.B.C" minimum version of the game the pack can run on.
	MinEngineVersion string `json:"min_engine_version,omitempty"`
	// The name of the pack. Can be text or a translation key.
	Name string `json:"name"`
	// "world", "global" or "any". Defaults to "any".
	PackScope string `json:"pack_scope,omitempty"`
	// xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	UUID string `json:"uuid"`
	// "A.B.C" current version of the pack.
	Version string `json:"version"`
}

type Module struct {
	// An internal description of the module.
	Description string `json:"description,omitempty"`
	// "resources", "data", "persona_piece", "skin_pack", "world_template" or "script".
	Type string `json:"type"`
	UUID string `json:"uuid"`
	// "A.B.C"
	Version string `json:"version"`
	// Specific to script modules. Only supports "javascript".
	Language string `json:"language,omitempty"`
	// Specific to script modules. Relative path to the main script file.
	Entry string `json:"entry,omitempty"`
}

// Dependency は「パック依存」と「スクリプトモジュール依存」の2種類を1つの型で表す。
//   - パック依存:           UUID + Name + Version
//   - スクリプトモジュール依存: ModuleName + Version (UUID は任意)
type Dependency struct {
	UUID       string     `json:"uuid,omitempty"`
	Name       string     `json:"name,omitempty"`
	ModuleName string     `json:"module_name,omitempty"`
	Version    DepVersion `json:"version"`
}

// DepVersion は version が "1.2.3" (文字列) と [1, 2, 3] (int配列) の
// どちらでも書ける仕様に対応するための型。
type DepVersion struct {
	Str string // 文字列で書かれていた場合
	Arr []int  // 配列で書かれていた場合
}

func (v *DepVersion) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err == nil {
		v.Str, v.Arr = s, nil
		return nil
	}
	var a []int
	if err := json.Unmarshal(b, &a); err == nil {
		v.Str, v.Arr = "", a
		return nil
	}
	return fmt.Errorf("dependency version must be a string or an int array: %s", b)
}

func (v DepVersion) MarshalJSON() ([]byte, error) {
	if v.Arr != nil {
		return json.Marshal(v.Arr)
	}
	return json.Marshal(v.Str)
}

type Metadata struct {
	// List of creators of the pack, currently mandatory in this version.
	Authors []string `json:"authors"`
	// License the pack is distributed under.
	License string `json:"license,omitempty"`
	// Tools used to generate the manifest. key = tool name, value = versions ("A.B.C").
	GeneratedWith map[string][]string `json:"generated_with,omitempty"`
	// "addon" makes the resource pack required to be downloaded by other players.
	ProductType string `json:"product_type,omitempty"`
	// URL to a website.
	URL string `json:"url,omitempty"`
}

type Subpack struct {
	// Name of the folder where the sub-pack is located.
	FolderName string `json:"folder_name"`
	// In-game display name of the sub-pack.
	Name string `json:"name"`
	// Minimum amount of RAM required to run the sub-pack (1-5).
	MemoryPerformanceTier int `json:"memory_performance_tier,omitempty"`
}

// Setting は label / toggle / slider / dropdown / multiselect の全種類を
// 1つの型にまとめたもの。Type を見て、どのフィールドが意味を持つか判断する。
type Setting struct {
	// "label", "toggle", "slider", "dropdown" or "multiselect"
	Type string `json:"type"`
	// User-visible text.
	Text string `json:"text"`
	// Programmatic identifier (must include a namespace). label には無い。
	Name string `json:"name,omitempty"`
	// 型が Type によって変わる (toggle: bool, slider: number, dropdown: string...)
	// ので、生の JSON のまま持っておき、使う側で解釈する。
	Default json.RawMessage `json:"default,omitempty"`
	// slider only. 0 が有効な値なので、「未指定」と区別するためにポインタにしている。
	Min  *float64 `json:"min,omitempty"`
	Max  *float64 `json:"max,omitempty"`
	Step *float64 `json:"step,omitempty"`
	// dropdown / multiselect only.
	Options []SettingOption `json:"options,omitempty"`
}

type SettingOption struct {
	Text string `json:"text"`
	Name string `json:"name"`
}