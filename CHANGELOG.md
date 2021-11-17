# @pkerschbaum/cypress-image-snapshot

## 1.0.1

### Patch Changes

- a07f1a3: add @types/jest-image-snapshot as peerDependency to avoid compilation errors (when used in TypeScript projects with skipLibCheck false)

## 1.0.0

### Major Changes

- c429e18: refactor: migrate project from babel&js to typescript

  chore(deps)!: bump cypress to ^8.7.0

- ab85219: refactor!: use /lib directory for compiled output

  refactor!: move jest-image-snapshot to peerDependencies

  chore(deps): bump some dependencies to latest

  setup: add ESLint rules, pre-commit prettier format, VS Code settings.json

  feat!: snapshots are now stored **next** to the Cypress spec file in the folder `__cy_image_snapshots__`
  That's why `customSnapshotsDir` and `customDiffDir` got removed.

### Patch Changes

- 19c00dd: test: fix tests when developing on windows
- de02cf4: chore(package.json): change repository&author
