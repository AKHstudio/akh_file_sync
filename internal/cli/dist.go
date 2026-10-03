package cli

import (
	"akh_file_sync/internal/config"
	"akh_file_sync/internal/dist"
	"akh_file_sync/internal/ui"
	"fmt"
	"os"
	"regexp"

	"github.com/spf13/cobra"
)

var distType = []string{"addon"}
var setVersion = "1.0.0"
var setWorldName = "{name} {version}"

var versionPattern = regexp.MustCompile(`^\d+\.\d+\.\d+(-.+)?$`)

var distCmd = &cobra.Command{
	Use:   "dist [directory...]",
	Short: "Dist files between two directories",
	Args:  cobra.ArbitraryArgs,
	PreRunE: func(cmd *cobra.Command, args []string) error {
		// dist type validation
		allowed := map[string]bool{
			"world": true,
			"addon": true,
		}

		for _, v := range distType {
			if !allowed[v] {
				return fmt.Errorf("invalid value %q for --type: must be one of world, addon", v)
			}
		}
		// setVersion validation
		if !versionPattern.MatchString(setVersion) {
			return fmt.Errorf("invalid --set-version %q: expected x.y.z or x.y.z-prerelease", setVersion)
		}

		// only flag validation
		return validateOnly(only)
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		ui.Debug("run dist command", "args", args)
		cfg, err := config.GetConfig()
		if err != nil {
			ui.Error(err.Error())
			os.Exit(1)
		}

		distOptions := dist.Options{
			Addons:       args,
			SetVersion:   setVersion,
			SetWorldName: setWorldName,
			Type:         distType,
		}

		if err := dist.Run(cfg, distOptions); err != nil {
			ui.Error(err.Error())
			os.Exit(1)
		}

		ui.Success("successful dist")

		return nil
	},
}

func init() {
	rootCmd.AddCommand(distCmd)
	distCmd.Flags().StringVarP(&only, "only", "o", only, "Dist only addon type (behavior , resource, all)")
	distCmd.Flags().StringSliceVarP(&distType, "type", "t", distType, "dist type (world , addon)")
	distCmd.Flags().StringVar(&setVersion, "set-version", setVersion, "Set the version of the dist")
	distCmd.Flags().StringVar(&setWorldName, "set-world-name", setWorldName, "Set the world name of the dist. replace {name} : dirName , {version} : version")
}
