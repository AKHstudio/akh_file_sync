package build

import (
	"cmp"
	"errors"
	"slices"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

type Message struct {
	Kind esbuild.MessageKind
	Text string
}

type rawMessage struct {
	msg  esbuild.Message
	kind esbuild.MessageKind
}

var ErrCompileFailed = errors.New("failed compile")

func compile(entry string, outfile string, tsconfig string, dev bool) ([]Message, error) {
	var sourceMap esbuild.SourceMap = esbuild.SourceMapNone
	if dev {
		sourceMap = esbuild.SourceMapLinked
	}

	option := esbuild.BuildOptions{
		EntryPoints:       []string{entry},
		Bundle:            true,
		Outfile:           outfile,
		MinifyWhitespace:  !dev,
		MinifyIdentifiers: !dev,
		MinifySyntax:      !dev,
		Sourcemap:         sourceMap,
		SourcesContent:    esbuild.SourcesContentExclude,
		Platform:          esbuild.PlatformNode,
		Target:            esbuild.ES2025,
		Format:            esbuild.FormatESModule,
		Write:             true,
		External: []string{
			"@minecraft/server",
			"@minecraft/server-ui",
			"@minecraft/server-admin",
			"@minecraft/server-gametest",
			"@minecraft/server-net",
			"@minecraft/server-common",
			"@minecraft/server-editor",
			"@minecraft/debug-utilities",
		},
		Tsconfig: tsconfig,
	}

	result := esbuild.Build(option)

	var all []rawMessage
	for _, m := range result.Errors {
		all = append(all, rawMessage{m, esbuild.ErrorMessage})
	}
	for _, m := range result.Warnings {
		all = append(all, rawMessage{m, esbuild.WarningMessage})
	}

	slices.SortStableFunc(all, func(a, b rawMessage) int {
		la, lb := a.msg.Location, b.msg.Location
		switch {
		case la == nil && lb == nil:
			return 0
		case la == nil:
			return -1 // 位置のないメッセージは先頭に（esbuild 本体と同じ扱い）
		case lb == nil:
			return 1
		}
		return cmp.Or(
			cmp.Compare(la.File, lb.File),
			cmp.Compare(la.Line, lb.Line),
			cmp.Compare(la.Column, lb.Column),
		)
	})

	var messages []Message
	for _, m := range all {
		s := esbuild.FormatMessages([]esbuild.Message{m.msg}, esbuild.FormatMessagesOptions{Kind: m.kind})
		messages = append(messages, Message{Text: s[0], Kind: m.kind})
	}

	if len(result.Errors) > 0 {
		return messages, ErrCompileFailed
	}

	return messages, nil
}
