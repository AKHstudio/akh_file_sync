# {{PROJECT_NAME}}

{{ADDON_DESCRIPTION}}

## 🚀 Getting Started

This project was created using [create-akhsync](https://github.com/AKHstudio/akh_file_sync/tree/main/packages/create-akhsync).

### Prerequisites

- Node.js 20.11.1 or higher
- Minecraft Bedrock Edition

### Installation

Install dependencies:

```bash
npm install
```

## 📦 Available Scripts

### `npm run build`

Build your addon for production. Compiles TypeScript to JavaScript and bundles the addon.

### `npm run watch`

Watch mode for development. Automatically rebuilds when you make changes.

### `npm run sync`

Sync the built addon to your Minecraft development folders.

### `npm run async`

Asynchronous sync to Minecraft.

### `npm run dist`

Create a distribution package of your addon.

### `npm run lint`

Check your code for linting errors.

### `npm run lint:fix`

Automatically fix linting errors.

### `npm run format`

Check your code formatting.

### `npm run format:fix`

Automatically fix code formatting.

## 📁 Project Structure

```
{{PROJECT_NAME}}/
├── src/
│   └── {{ADDON_NAME}}/
│       ├── behavior_packs/
│       │   ├── manifest.json
│       │   └── scripts/
│       │       └── main.ts
│       └── resource_packs/
│           └── manifest.json
├── akhsync.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Akhsync Config

Edit `akhsync.config.ts` to customize the build process:

```typescript
import { AKHsyncConfig } from '@akhstudio/akhsync/config';

const config: AKHsyncConfig = {
    // Add your configuration here
};

export default config;
```

### TypeScript Config

Modify `tsconfig.json` to adjust TypeScript compiler options.

## 📝 Development

1. Edit your addon scripts in `src/{{ADDON_NAME}}/behavior_packs/scripts/`
2. Run `npm run watch` to start development mode
3. Changes will automatically rebuild and sync to Minecraft

## 🎮 Testing

1. Build your addon: `npm run build`
2. Sync to Minecraft: `npm run sync`
3. Launch Minecraft and load your world
4. Test your addon in-game

## 📚 Resources

- [Akhsync Documentation](https://akhstudio.github.io/akh_file_sync/)
- [Minecraft Bedrock Documentation](https://learn.microsoft.com/en-us/minecraft/creator/)
- [@minecraft/server API](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Your Name

---

Happy coding! 🎮✨
