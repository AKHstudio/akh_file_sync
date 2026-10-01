package cli

import (
	"akh_file_sync/internal/build"
	"akh_file_sync/internal/config"
	"akh_file_sync/internal/link"
	"akh_file_sync/internal/ui"
	"os"

	"github.com/spf13/cobra"
)

var asyncCmd = &cobra.Command{
	Use:   "async [directory...]",
	Short: "Async files between two directories",
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
		if err := link.Unlink(cfg, buildOpts); err != nil {
			ui.Error(err.Error())
			os.Exit(1)
		}

		ui.Success("successful async")
		return nil
	},
}

func init() {
	rootCmd.AddCommand(asyncCmd)
	asyncCmd.Flags().StringVarP(&only, "only", "o", only, "Async only addon type (behavior , resource, all)")
}
