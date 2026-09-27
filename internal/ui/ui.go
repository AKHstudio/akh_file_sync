package ui

import (
	"fmt"
	"io"
	"log/slog"
	"os"
	"strings"
	"time"

	"github.com/fatih/color"
	"github.com/lmittmann/tint"
	"github.com/mattn/go-colorable"
)

var (
	debugMode    bool
	logger       *slog.Logger
	successColor = color.New(color.FgGreen)
	infoColor    = color.New(color.FgBlue)
	warnColor    = color.New(color.FgYellow)
	errorColor   = color.New(color.FgRed)
	argsColor    = color.New(color.Faint)
	faintColor   = color.New(color.Faint)
)

func Init(debug bool) {
	debugMode = debug
	if debug {
		h := tint.NewTextHandler(colorable.NewColorable(os.Stderr), &tint.Options{
			Level:      slog.LevelDebug,
			TimeFormat: "15:04:05.000",
		})
		logger = slog.New(h)
	}
}

func printLine(w io.Writer, c *color.Color, icon, msg string, args []any) {
	line := c.Sprint(icon + " " + msg)
	if s := argsFormat(args); s != "" {
		line += " " + faintColor.Sprint(s)
	}
	fmt.Fprintln(w, line)
}

func Success(msg string, args ...any) {
	if debugMode {
		logger.Info(msg, args...)
		return
	}

	printLine(color.Output, successColor, "✅️", msg, args)
}

func Info(msg string, args ...any) {
	if debugMode {
		logger.Info(msg, args...)
		return
	}

	printLine(color.Output, infoColor, "ℹ️", msg, args)
}

func Warn(msg string, args ...any) {
	if debugMode {
		logger.Warn(msg, args...)
		return
	}

	printLine(color.Error, warnColor, "⚠️", msg, args)
}

func Error(msg string, args ...any) {
	if debugMode {
		logger.Error(msg, args...)
		return
	}

	printLine(color.Error, errorColor, "❌", msg, args)
}

func Debug(msg string, args ...any) {
	if debugMode {
		logger.Debug(msg, args...)
		return
	}
}

func argsFormat(args []any) string {
	var formatted []string
	r := slog.NewRecord(time.Time{}, slog.LevelInfo, "", 0)
	r.Add(args...)
	r.Attrs(func(a slog.Attr) bool {
		formatted = append(formatted, fmt.Sprintf("%s=%s ", a.Key, a.Value.String()))
		return true
	})

	return strings.Join(formatted, " ")
}
