package cli

import (
	"akh_file_sync/internal/ui"

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
	Run: func(cmd *cobra.Command, args []string) {
		ui.Debug("run sync command", "args", args)
	},
}

func init() {
	rootCmd.AddCommand(syncCmd)
	syncCmd.Flags().BoolVarP(&developmentFlag, "development", "d", false, "Build the project in development mode")
	syncCmd.Flags().StringVarP(&only, "only", "o", only, "Sync only addon type (behavior , resource, all)")
	syncCmd.Flags().BoolVar(&noBuildFlag, "no-build", false, "Do not build the project before syncing")
}
