package cli

import (
	"akh_file_sync/internal/ui"
	"fmt"

	"github.com/spf13/cobra"
)

// version
var version = "dev"

// flags
var debugFlag bool
var developmentFlag bool
var only = "all"

var rootCmd = &cobra.Command{
	Use:           "akhsync",
	Short:         "A simple CLI tool to sync files between two directories",
	Version:       version,
	SilenceUsage:  true,
	SilenceErrors: true,
	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
		ui.Init(debugFlag)
		return nil
	},
}

func Execute() error {
	err := rootCmd.Execute()
	if err != nil {
		return fmt.Errorf("failed command execute: %w", err)
	}
	return nil
}

func init() {
	rootCmd.PersistentFlags().BoolVar(&debugFlag, "debug", debugFlag, "Run debug mode")
}

func validateOnly(v string) error {
	if v != "behavior" && v != "resource" && v != "all" {
		return fmt.Errorf("invalid value %q for --only: must be one of behavior, resource, all", v)
	}
	return nil
}
