# Development Quick Start

## Installation

```bash
npm install
```

## Development

```bash
# Watch mode - rebuilds on file changes
npm run dev
```

## Building

```bash
# Production build
npm run build
```

This will create a `main.js` file that Obsidian can load.

## Testing in Obsidian

1. Copy or symlink this folder to your vault's plugin directory:
   ```
   /path/to/vault/.obsidian/plugins/obsidian-sync-client/
   ```

2. In Obsidian:
   - Settings → Community Plugins
   - Reload plugins
   - Enable "Custom Sync Client"

3. Configure in Settings → Custom Sync Client

## File Structure

```
├── main.ts              # Plugin entry point
├── SettingsTab.ts       # Settings UI with auth flow
├── NetworkClient.ts     # API communication
├── types.ts             # Type definitions
├── styles.css           # UI styles
├── manifest.json        # Plugin metadata
├── package.json         # npm config
├── tsconfig.json        # TypeScript config
├── esbuild.config.mjs   # Build config
├── version-bump.mjs     # Version management
└── versions.json        # Version compatibility
```

## Key Features Implemented

### 1. Settings UI (`SettingsTab.ts`)
- ✅ Email input with validation
- ✅ "Get Code" button → calls `POST /auth/otp/request`
- ✅ 6-digit code input (auto-formats)
- ✅ "Login" button → calls `POST /auth/otp/verify`
- ✅ JWT token saved to `plugin.data.token`
- ✅ Device name configuration
- ✅ Login status display
- ✅ Logout functionality

### 2. Network Client (`NetworkClient.ts`)
- ✅ All `/obsidian/*` requests include `Authorization: Bearer <TOKEN>`
- ✅ 401 error → Alert "Session expired, please login again."
- ✅ 403 error → Alert "Storage limit reached."
- ✅ Device name sent via `X-Device-Name` header
- ✅ File path sent via `X-File-Path` header

### 3. Sync Logic (`main.ts`)
- ✅ Upload files with device name header
- ✅ Download files
- ✅ Manual sync command
- ✅ Ribbon icon for quick sync
- ✅ Auto-save settings
- ✅ Session expiry handling

## API Integration

Your backend needs these endpoints:

### Auth
- `POST /auth/otp/request` - Send OTP to email
- `POST /auth/otp/verify` - Verify OTP, return JWT

### Files
- `POST /obsidian/files` - Upload file
- `GET /obsidian/files` - List files
- `GET /obsidian/files/:path` - Download file
- `DELETE /obsidian/files/:path` - Delete file

All file endpoints require `Authorization: Bearer <TOKEN>` header.

## Troubleshooting

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Plugin not loading in Obsidian:**
- Check console (Ctrl+Shift+I) for errors
- Ensure `main.js` exists after build
- Verify `manifest.json` is valid JSON

**Type errors:**
- Run `npm install` to get Obsidian types
- Check `tsconfig.json` settings
