# Fieldnotes

A small, local-first goals app built with Expo SDK 58, React Native 0.88, TypeScript, and Expo Router. Warm paper tones, forest-green controls, and a straightforward list keep the focus on the next step.

## What you can do

- Create and edit goals with notes, a category, and normal or high priority.
- Complete or reopen goals using the checkbox; open a row to see its details.
- Search titles and notes, filter by status/category, and sort by date or priority.
- Review total completion and a category breakdown on the Progress screen.
- Delete a goal or clear the completed goals in the current filtered view.
- Undo the latest deletion until it is dismissed, another deletion happens, or the app restarts.
- Keep goals across app restarts without an account or network connection.

## Run locally

Use Node.js 24 LTS and npm. This repository uses `package-lock.json`.

```sh
npm ci
npm start
```

For an Android emulator or connected device:

```sh
npm run android
```

The project includes `expo-dev-client`. A development build is the recommended native environment. For a compatible Expo Go installation, explicitly use:

```sh
npx expo start --go
```

Expo Go contains only its bundled native modules. If it reports a missing native module, use the development build below. Rebuild the development client after changing native dependencies.

Other previews:

```sh
npm run ios
npm run web
```

iOS Simulator requires macOS. A physical iPhone can use an appropriate EAS development build. If Metro's usual port is occupied, add `-- --port 8082` to an npm start command. After dependency changes, restart with `npx expo start --clear`.

## Build with EAS

The checked-in profiles are:

| Profile       | Purpose                                         | Android output  |
| ------------- | ----------------------------------------------- | --------------- |
| `development` | Native debugging with the development client    | Installable APK |
| `preview`     | Internal standalone testing                     | Installable APK |
| `production`  | Store distribution, automatic version increment | App bundle      |

```sh
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile development
npx expo start --dev-client
```

For a standalone test build:

```sh
npx eas-cli@latest build --platform android --profile preview
```

Before publishing, link your Expo project, review the existing application identifiers in `app.json`, and replace the starter launcher/splash assets with your production artwork. Cloud builds and store submissions are not performed by the local checks. Native directories use Continuous Native Generation: configure native behavior through `app.json` and plugins rather than editing generated `android/` or `ios/` files.

## Quality checks

```sh
npm run lint
npm run typecheck
npm test
npx expo-doctor
npx expo export --platform android --platform web
```

The Node tests cover validation, whitespace preservation, local ID collisions, combined filters, non-mutating sort order, storage round trips/corruption, and progress calculation. CI runs lint, strict TypeScript, tests, and an Android bundle export on pushes and pull requests. See [the device checklist](docs/testing.md) for manual coverage.

## Project structure

```text
src/
  app/                 Expo Router routes and root providers
    goal/new.tsx       Create a goal
    goal/[id]/         Details and editing
    progress.tsx       Completion overview
  components/          Shared controls, editor, rows, filters, dialogs
  domain/goals.ts      Goal types, validation, filtering, storage schema
  hooks/               Reduced-motion preference
  screens/             Composed goals screen
  state/               Persistent goal store and mutations
  utils/               Optional native feedback
  theme.ts             Shared palette and layout tokens
tests/                 Pure domain regression tests
```

## Mobile behavior

- Safe-area insets handle system bars and device cutouts.
- Controls use at least 48 dp touch targets, Android ripples, and visible pressed states.
- Completion uses a separate checkbox; deletion requires confirmation.
- Inputs preserve spaces while typing and trim only when saved.
- Scrollable forms and keyboard avoidance keep actions reachable.
- Unsaved changes are protected when navigating away. Saving blocks duplicate submissions.
- Native feedback is optional and cannot fail a save. Navigation and dialogs respect reduced motion.
- Screen-reader roles, selection/checked states, progress values, and completion announcements are provided.
- `FlatList` virtualizes goal rows; derived filters are memoized. Content width is bounded on tablets and web.

## Data and limitations

Goals are saved as a versioned JSON document under `@fieldnotes/goals/v1` in AsyncStorage. Writes finish before the UI reports success. Failed writes preserve the previous list and display an error; unreadable or unknown-version data is not silently overwritten. Undo history is session-only.

Storage is local and unencrypted. There is no cloud sync, account, reminder service, or export/backup feature. Clearing app data or uninstalling can remove goals. The app uses a light theme; iOS, physical-device haptics, and assistive-technology behavior should be checked before a release.

The dependency audit currently reports a high-severity Zod advisory through Expo CLI (three affected package entries). Expo Doctor reports SDK compatibility, which is a separate check. The audit's suggested automatic fix downgrades Expo across major SDK versions; it has intentionally not been applied. Recheck upstream fixes before release.

## References

- [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/)
- [Expo Router installation](https://docs.expo.dev/router/installation/)
- [Expo Haptics](https://docs.expo.dev/versions/v58.0.0/sdk/haptics/)
- [React Native Pressable](https://reactnative.dev/docs/pressable)
- [EAS build profiles](https://docs.expo.dev/build/eas-json/)
