# @pkerschbaum/cypress-image-snapshot

This is a fork of [jaredpalmer/cypress-image-snapshot](https://github.com/jaredpalmer/cypress-image-snapshot) with following changes applied:

- The project was re-written with TypeScript (no `@types/cypress-image-snapshot` necessary anymore).
- Snapshots are now stored **next** to the Cypress spec file in the folder `__cy_image_snapshots__`.  
  That's why the options `customSnapshotsDir` and `customDiffDir` were removed.

## Installation

Using npm:

```bash
npm install --save-dev @pkerschbaum/cypress-image-snapshot jest-image-snapshot
```

Using yarn:

```bash
yarn add --dev @pkerschbaum/cypress-image-snapshot jest-image-snapshot
```

then add the following in your project's `<rootDir>/cypress/plugins/index.js`:

```js
import { addMatchImageSnapshotPlugin } from '@pkerschbaum/cypress-image-snapshot/lib/plugin';

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
};
```

and in `<rootDir>/cypress/support/commands.js` add:

```js
import { addMatchImageSnapshotCommand } from '@pkerschbaum/cypress-image-snapshot/lib/command';

addMatchImageSnapshotCommand();
```

## Syntax, Usage, ...

See [jaredpalmer/cypress-image-snapshot](https://github.com/jaredpalmer/cypress-image-snapshot).
