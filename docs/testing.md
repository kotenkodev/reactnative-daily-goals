# Validation and device checks

## Checked during this implementation

- Expo lint: passed.
- Strict TypeScript: passed.
- Eight Node domain regression tests: passed.
- Expo Doctor: 20/20 checks passed.
- Production Android (Hermes) and web exports: passed.
- Android emulator / Expo Go: home layout, blank-title rejection, multiword goal creation, category selection, persistence after process restart, detail navigation, editing priority, Android Back draft protection, completion date, confirmed deletion, undo restoring completion and priority, the Done filter, clearing completed goals, and the progress screen were exercised. Temporary test goals were removed afterward.

The emulator initially lacked `ExpoCrypto`. Local ID creation no longer needs that native dependency. The app still uses native AsyncStorage and optional haptics; use an EAS development build when a particular Expo Go installation lacks a required module.

No signed EAS build or store submission was run. iOS, physical haptic feel, TalkBack/VoiceOver, and the remaining cases below require device validation before release. Emulator interaction checks are manual smoke checks, not an automated end-to-end suite.

## Release checklist

1. **Create and edit:** reject blank/whitespace-only titles; preserve internal spaces; accept 120-character titles and 2,000-character notes; cancel a dirty draft and choose both keep/discard; save without a duplicate record.
2. **Keyboard and layout:** try a small Android device, tablet, landscape-capable web viewport, and iOS device. Open the keyboard in both fields, scroll to Save, and dismiss the keyboard. Use maximum system font size and check that text and actions remain reachable.
3. **Filter combinations:** combine search, status, category, and all three sort modes. Match text in notes. Clear a query, reset an empty result, and verify a newly added goal appears in Active.
4. **Completion:** toggle from a row and from details. Check Active/Done counts, the category breakdown, completion date, and reopening.
5. **Delete/undo:** cancel and confirm deletion; undo with metadata intact; dismiss undo; delete twice and verify only the latest deletion is undoable. Clear a filtered subset of completed goals and verify other categories remain.
6. **Storage:** restart after each kind of mutation. Simulate a rejected write and verify the old state remains and an error is visible. In an isolated test installation, inject invalid JSON or a future schema and verify retry does not erase saved data.
7. **Navigation:** open a missing goal URL, use Android Back, dismiss a confirmation with Back, and navigate directly to create/edit while storage loads.
8. **Accessibility:** use TalkBack/VoiceOver to identify every action; verify checkbox state, filter selection, progress values, errors, and completion announcements. Enable reduced motion and verify transitions are disabled.
9. **Native feedback:** check ripples and subtle confirmation haptics on physical Android and iOS hardware. The app must continue saving when haptics are unavailable.
10. **Build:** run the quality commands in the README, install an EAS preview APK, and repeat the main flow without Metro. Review app identifiers and starter assets before store delivery.

## Dependency audit

`npm audit` reports three high-severity package entries caused by the Zod advisory inherited through Expo CLI. The suggested automatic resolution downgrades Expo to SDK 54, so it was not applied to this SDK 58 project. Track an SDK-compatible upstream fix; do not use `npm audit fix --force` without reviewing the resulting SDK change.
