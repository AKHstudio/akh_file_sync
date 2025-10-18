# akhsync

[![GitHub license](https://img.shields.io/github/license/AKHstudio/akh_file_sync.svg)](https://github.com/AKHstudio/akh_file_sync/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@akhstudio/akhsync.svg)](https://www.npmjs.com/package/@akhstudio/akhsync/v/latest)
[![npm downloads](https://img.shields.io/npm/dt/@akhstudio/akhsync.svg)](https://www.npmjs.com/package/@akhstudio/akhsync)

[日本語のREADMEはこちら](./README_JP.md)

## What is akhsync?

A library created by AKHStudio for developing add-ons for Minecraft Bedrock Edition.

Detailed command documentation is available on the GitHub Wiki.

[View Documentation](https://akhstudio.github.io/akh_file_sync/)

## Installation

If your project is already initialized, you can install `akhsync` with the following command:

```sh
npm install @akhstudio/akhsync@latest --save-dev
```

> [!NOTE]
>
> Using the `-g` option will install it globally, allowing you to use the `akhsync` command directly.

> [!IMPORTANT]
> When installing globally, be mindful of your project's directory structure.

```sh
npm install -g @akhstudio/akhsync@latest
```

## Getting Started

### 1. Initialize npm

```sh
npm init your_project_name -y
```

### 2. Create File Structure

The root directory structure of your add-on development project should look like this:

```
your_project_root
    |-- src/ (Development source code)
        |-- addon1/
            |-- behavior_packs/
            |   |-- scripts/
            |       |-- main.js
            |-- resource_packs/
        |-- addon2/ (For developing multiple add-ons - optional)
            |-- behavior_packs/
            |   |-- scripts/
            |       |-- main.ts
            |-- resource_packs/
    |-- world/ (World data for builds - optional)
    |-- tsconfig.json (Only if using TypeScript)
    |-- package.json
```

### 3. Install Required Libraries

Install the `@minecraft` libraries according to the version you want to use.

[Version List - @minecraft/server](https://www.npmjs.com/package/@minecraft/server?activeTab=versions)

[Version List - @minecraft/server-ui](https://www.npmjs.com/package/@minecraft/server-ui?activeTab=versions)

Below is an example of installing the latest stable version.

#### akhsync

```sh
npm install @akhstudio/akhsync@latest --save-dev
```

#### @minecraft/server

```sh
npm install @minecraft/server@latest --save-dev
```

#### @minecraft/server-ui (If using UI)

```sh
npm install @minecraft/server-ui@latest --save-dev
```

### 3.1 Create tsconfig.json if Using TypeScript (Optional)

> [!IMPORTANT]
>
> - This step is not necessary if you're not using TypeScript.

> [!NOTE]
>
> - If using the `@minecraft/math` module, adjust the `paths` option accordingly.
> - The configuration below is an example. Adjust it to fit your project.

```json title="tsconfig.json"
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "esnext",
        "moduleResolution": "bundler",
        "baseUrl": "./",
        "paths": {
            "@minecraft/math": ["node_modules/@minecraft/math/dist/minecraft-math.d.ts"]
        },
        "resolvePackageJsonImports": true,
        "allowJs": true,
        "noEmit": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true
    },
    "include": ["**/scripts/**/*"],
    "exclude": ["node_modules", "build", "dist"]
}
```

### 4. Add Scripts to package.json

```json title="package.json"
{
    "scripts": {
        "build": "akhsync build",
        "sync": "akhsync sync",
        "async": "akhsync async",
        "watch": "akhsync watch",
        "dist": "akhsync dist"
    }
}
```

> [!TIP]
>
> If you want to specify additional options, add them after `--`.
>
> ```sh
> npm run build -- --development
> ```
