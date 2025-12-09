# Kwik Send Browser Extension

Secure zero-knowledge file sharing directly from your browser. One-click encrypted uploads with Chrome, Firefox, and Edge.

## Features

- **One-Click Upload**: Share files instantly from any webpage
- **Zero-Knowledge Encryption**: Files encrypted client-side with AES-256-GCM
- **Automatic Clipboard**: Share links copied automatically
- **Desktop Notifications**: Get notified when uploads complete
- **Upload History**: Access your 20 most recent shares
- **Customizable Settings**: Configure expiration times and download limits

## Installation

### Chrome Web Store (Coming Soon)

1. Visit [Chrome Web Store](https://chrome.google.com/webstore) and search for "Kwik Send"
2. Click "Add to Chrome"
3. Click "Add extension" to confirm

### Firefox Add-ons (Coming Soon)

1. Visit [Firefox Add-ons](https://addons.mozilla.org) and search for "Kwik Send"
2. Click "Add to Firefox"
3. Click "Add" to confirm

### Manual Installation (Development)

#### Chrome/Edge

1. Clone this repository
2. Run `pnpm install && pnpm build`
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the `dist` folder from this project

#### Firefox

1. Clone this repository
2. Run `pnpm install && pnpm build`
3. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Select `dist/manifest.json`

## Usage

### Quick Upload

1. Click the Kwik Send icon in your browser toolbar
2. Drag & drop a file or click to browse
3. Configure expiration time and download limit (optional)
4. Upload completes automatically
5. Share link is copied to clipboard

### Keyboard Shortcut (Future)

Press `Ctrl+Shift+K` (or `Cmd+Shift+K` on Mac) to open the upload dialog.

### Context Menu (Future)

Right-click any file link and select "Share with Kwik" to upload directly.

## Settings

Access settings by clicking the ⚙️ icon in the extension popup:

- **Default Expiration**: Set default link expiration time
- **Default Max Downloads**: Set default download limit
- **Auto Clipboard**: Automatically copy share link after upload
- **Notifications**: Enable desktop notifications for completed uploads

## Privacy & Security

- **Client-Side Encryption**: All files encrypted in your browser before upload
- **Zero-Knowledge**: Server cannot decrypt your files
- **No Tracking**: No analytics, no cookies, no user tracking
- **Open Source**: Full source code available for audit

## Development

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Watch mode (auto-rebuild)
pnpm dev

# Clean build artifacts
pnpm clean
```

### Project Structure

```
extension/
├── public/
│   ├── manifest.json       # Extension manifest (v3)
│   ├── popup.html          # Popup UI
│   └── icons/              # Extension icons
├── src/
│   ├── background.ts       # Service worker
│   ├── popup.ts            # Popup logic
│   └── types.ts            # TypeScript types
├── dist/                   # Build output
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Browser Support

- Chrome 88+
- Firefox 75+
- Edge 88+
- Opera 74+

## Permissions

The extension requires the following permissions:

- `storage`: Save upload history and settings
- `clipboardWrite`: Auto-copy share links
- `notifications`: Show upload completion notifications
- `https://kwik.gg/*`: Communicate with Kwik API

## Contributing

Contributions welcome! Please read our [Contributing Guide](https://github.com/kwiklabs/extension/blob/canary/CONTRIBUTING.md).

## License

MIT © Kwik Labs

## Links

- [Website](https://kwik.gg)
- [Documentation](https://kwik.gg/docs/extension)
- [GitHub](https://github.com/kwiklabs/extension)
- [Report Issues](https://github.com/kwiklabs/extension/issues)
- [Privacy Policy](https://kwik.gg/privacy)
