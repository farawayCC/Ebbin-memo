# Ebbinghaus Memo

A small desktop app for saving plain-text memos and recalling them at spaced intervals.

## Requirements

- Node.js 22.12 or later (Node 22 is pinned in `.nvmrc`)
- npm 10 or later
- macOS, Windows, or a Linux desktop with notification support

## Run locally

```sh
npm ci
npm start
```

The first desktop launch may download Electron. `npm start` starts the local Vite server and Electron together; quit Electron to stop both. For browser-only development, use `npm run dev:web` and open the address printed in the terminal. Native desktop notifications and tray behavior require Electron.

## Use

1. Enter a memo and select **Create**, or press Enter.
2. Keep the app running. Closing or minimizing its window hides it in the system tray when a tray is available.
3. Open it again from the tray. Use the tray's **Quit** command to exit fully.

Reminders occur after 10 minutes, 1 hour, 5 hours, 1 day, 5 days, 25 days, and 120 days (approximately four months). The app checks every 15 seconds and when its window regains focus. After sleep or reopening, it sends one catch-up reminder per memo for the latest missed interval. Delivered intervals are saved so they are not repeated on every launch. Delivery records that the reminder was raised, rather than that the memo was reviewed. OS notification settings may suppress native notifications; the latest reminder also appears inside the app.

Memos remain in local storage using the original `persist:root` format. Existing memos need no manual conversion. Development and packaged builds can use different storage origins; a browser preview does not share the desktop's memos. Reminders do not run while the app is fully quit.

## Verify and package

```sh
npm test
npm run build:web
npm run pack
```

`build:web` writes renderer assets to `build/`. `pack` creates an unpacked desktop app in `dist/`. `npm run build` creates installers for the current platform; signing may require platform-specific credentials. To create an unsigned local macOS package, set `CSC_IDENTITY_AUTO_DISCOVERY=false` when packaging. `npm run release` explicitly publishes with electron-builder and requires release credentials.

CI runs the regression tests and packages the app on macOS, Windows, and Linux. Tests cover reminder boundaries, restart catch-up, long intervals, legacy memo compatibility, and deletion of duplicate titles.

## Maintenance

The app uses React 19, Vite 8, and Electron 44, with an isolated preload bridge for native notifications. Use npm and commit `package-lock.json` when updating dependencies.

Potential follow-ups include explicit review acknowledgment, optional notification deferral, and launch-at-login support.

[Learn about the forgetting curve](https://en.wikipedia.org/wiki/Forgetting_curve).

The runtime dependency audit is clean. The current electron-builder dependency chain still reports moderate `sprintf-js` advisories; compatible fixes have been applied, and no high-severity findings remain. Recheck with `npm audit` when updating the packaging tools.
