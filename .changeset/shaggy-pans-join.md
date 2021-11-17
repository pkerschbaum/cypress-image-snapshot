---
'@pkerschbaum/cypress-image-snapshot': major
---

refactor!: use /lib directory for compiled output

refactor!: move jest-image-snapshot to peerDependencies

chore(deps): bump some dependencies to latest

setup: add ESLint rules, pre-commit prettier format, VS Code settings.json

feat!: snapshots are now stored **next** to the Cypress spec file in the folder `__cy_image_snapshots__`  
That's why `customSnapshotsDir` and `customDiffDir` got removed.
