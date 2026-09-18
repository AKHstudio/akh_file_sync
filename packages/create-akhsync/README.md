# create-akhsync

Create Akhsync projects with a single command - the easiest way to get started with Minecraft Bedrock Edition addon development.

[![npm version](https://img.shields.io/npm/v/create-akhsync.svg)](https://www.npmjs.com/package/create-akhsync)
[![License](https://img.shields.io/npm/l/create-akhsync.svg)](https://github.com/AKHstudio/akh_file_sync/blob/main/LICENSE)

## Quick Start

```bash
npm create akhsync@latest
```

Or with a project name:

```bash
npm create akhsync@latest my-addon
```

## Features

✨ **Interactive CLI** - Answer a few questions to configure your project  
📦 **Multiple Templates** - Choose between TypeScript or JavaScript  
🔧 **Development Tools** - Optional ESLint and Prettier setup  
🎨 **Customizable** - Configure your project exactly how you want it  
🚀 **Ready to Go** - Start developing immediately after setup

## Usage

### Interactive Mode (Recommended)

Run without arguments to enter interactive mode:

```bash
npm create akhsync@latest
```

You'll be prompted to configure:

- Project name
- Addon name
- Description
- TypeScript (default: yes)
- ESLint (default: yes)
- Prettier (default: yes)
- Git initialization (default: yes)

### CLI Mode

Use command-line flags to skip the prompts:

```bash
npm create akhsync@latest my-addon --yes
```

### Available Options

```
Usage: create-akhsync [project-name] [options]

Arguments:
  project-name         Name of the project to create (default: "akhsync-project")

Options:
  -v, --version        Output the current version
  --git                Initialize a git repository
  --typescript         Use TypeScript (default)
  --lint               Set up ESLint configuration
  --prettier           Set up Prettier configuration
  -y, --yes            Skip prompts and use default values
  -h, --help           Output usage information
```

## What's Included

The generated project includes:

```
my-addon/
├── src/
│   └── my-addon/
│       ├── behavior_packs/
│       │   ├── manifest.json
│       │   └── scripts/
│       │       └── main.ts (or main.js)
│       └── resource_packs/
│           └── manifest.json
├── akhsync.config.ts (or .js)
├── package.json
├── tsconfig.json (TypeScript only)
├── eslint.config.js (if enabled)
├── .prettierrc (if enabled)
└── .gitignore
```

## Getting Started

After creating your project:

1. **Navigate to your project:**

    ```bash
    cd my-addon
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start developing:**
    ```bash
    npm run build    # Build your addon
    npm run watch    # Watch for changes and rebuild
    npm run sync     # Sync to Minecraft directory
    ```

## Generated Scripts

The project comes with pre-configured npm scripts:

- `npm run build` - Build your addon
- `npm run sync` - Sync files to Minecraft
- `npm run async` - Async sync
- `npm run watch` - Watch mode for development
- `npm run dist` - Create distribution package

If you enabled ESLint:

- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors

If you enabled Prettier:

- `npm run format` - Check code formatting
- `npm run format:fix` - Fix code formatting

## Template Features

### TypeScript Template

- Full TypeScript support
- Type definitions for @minecraft/server
- Configured tsconfig.json
- IntelliSense support

### JavaScript Template

- Modern ES modules
- Same project structure as TypeScript
- Faster setup without compilation

### Both Templates Include

- Pre-configured manifest.json files
- Sample script with event handler
- Proper UUID generation
- @minecraft/server integration
- Akhsync configuration

## Requirements

- Node.js 20.11.1 or higher
- npm, yarn, or pnpm

## Examples

### Create with TypeScript (default)

```bash
npm create akhsync@latest my-awesome-addon
```

### Create with JavaScript

```bash
npm create akhsync@latest my-addon
# Then select JavaScript when prompted
```

### Create with all defaults

```bash
npm create akhsync@latest my-addon --yes
```

### Create without Git

```bash
npm create akhsync@latest my-addon
# Then answer "no" to Git initialization
```

## Documentation

For more information about Akhsync and addon development:

- [Akhsync Documentation](https://akhstudio.github.io/akh_file_sync/)
- [GitHub Repository](https://github.com/AKHstudio/akh_file_sync)

## License

GPL-3.0 - See [LICENSE](LICENSE) for details

## Author

AKHstudio (tako1dayo)

---

Built with ❤️ for the Minecraft Bedrock Edition community
