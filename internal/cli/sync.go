package cli

import (
	"akh_file_sync/internal/build"
	"akh_file_sync/internal/config"
	"akh_file_sync/internal/link"
	"akh_file_sync/internal/ui"
	"os"

	"github.com/spf13/cobra"
)

var noBuildFlag bool

var syncCmd = &cobra.Command{
	Use:   "sync [directory...]",
	Short: "Sync files between two directories",
	Args:  cobra.ArbitraryArgs,
	PreRunE: func(cmd *cobra.Command, args []string) error {
		return validateOnly(only)
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg, err := config.GetConfig()
		if err != nil {
			ui.Error(err.Error())
			os.Exit(1)
		}
		buildOpts := build.Options{Addons: args, Development: developmentFlag, Only: only}
		if !noBuildFlag {
			if err := build.Run(cfg, buildOpts); err != nil {
				ui.Error(err.Error())
				os.Exit(1)
			}
			ui.Success("successful build. is syncing...")
		}
		if err := link.Link(cfg, buildOpts); err != nil {
			ui.Error(err.Error())
			os.Exit(1)
		}

		ui.Success("successful sync")
		return nil
	},
}

func init() {
	rootCmd.AddCommand(syncCmd)
	syncCmd.Flags().BoolVarP(&developmentFlag, "development", "d", false, "Build the project in development mode")
	syncCmd.Flags().StringVarP(&only, "only", "o", only, "Sync only addon type (behavior , resource, all)")
	syncCmd.Flags().BoolVar(&noBuildFlag, "no-build", false, "Do not build the project before syncing")
}
