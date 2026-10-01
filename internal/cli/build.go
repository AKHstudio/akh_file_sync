package cli

import (
	"akh_file_sync/internal/build"
	"akh_file_sync/internal/config"
	"akh_file_sync/internal/ui"
	"os"

	"github.com/spf13/cobra"
)

var buildCmd = &cobra.Command{
	Use:   "build [directory...]",
	Short: "Build the project",
	Args:  cobra.ArbitraryArgs,
	PreRunE: func(cmd *cobra.Command, args []string) error {
		return validateOnly(only)
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		config, err := config.GetConfig()
		if err != nil {
			ui.Error(err.Error())
			os.Exit(1)
		}

		err = build.Run(config, build.Options{Addons: args, Development: developmentFlag, Only: only})
		if err != nil {
			ui.Error(err.Error())
			os.Exit(1)
		}

		ui.Success("successful build")
		return nil
	},
}

func init() {
	rootCmd.AddCommand(buildCmd)
	buildCmd.Flags().BoolVarP(&developmentFlag, "development", "d", false, "Build the project in development mode")
	buildCmd.Flags().StringVarP(&only, "only", "o", only, "Build only addon type (behavior , resource, all)")
}
