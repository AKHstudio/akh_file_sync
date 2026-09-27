package cli

import (
	"akh_file_sync/internal/ui"

	"github.com/spf13/cobra"
)

var watchCmd = &cobra.Command{
	Use:   "watch [directory...]",
	Short: "Watch files between two directories",
	Args:  cobra.ArbitraryArgs,
	Run: func(cmd *cobra.Command, args []string) {
		ui.Debug("run watch command", "args", args)
	},
}

func init() {
	rootCmd.AddCommand(watchCmd)
	watchCmd.Flags().BoolVarP(&developmentFlag, "development", "d", false, "Build the project in development mode")
	// watchCmd.Flags().StringVarP(&only, "only", "o", only ,"Watch only addon type (behavior , resource, all)")
}
