package cli

import (
	"akh_file_sync/internal/ui"

	"github.com/spf13/cobra"
)

var asyncCmd = &cobra.Command{
	Use:   "async [directory...]",
	Short: "Async files between two directories",
	Args:  cobra.ArbitraryArgs,
	PreRunE: func(cmd *cobra.Command, args []string) error {
		return validateOnly(only)
	},
	Run: func(cmd *cobra.Command, args []string) {
		ui.Debug("run async command", "args", args)
	},
}

func init() {
	rootCmd.AddCommand(asyncCmd)
	asyncCmd.Flags().StringVarP(&only, "only", "o", only, "Async only addon type (behavior , resource, all)")
}
