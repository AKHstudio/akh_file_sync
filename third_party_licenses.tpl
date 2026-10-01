akhsync bundles the following third-party Go packages.

{{ range . }}
================================================================================
{{ .Name }} {{ .Version }}
{{ .LicenseName }}
{{ .LicenseURL }}
--------------------------------------------------------------------------------
{{ .LicenseText }}
{{ end }}