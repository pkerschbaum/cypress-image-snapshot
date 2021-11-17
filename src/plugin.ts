/**
 * Copyright (c) 2018-present The Palmer Group
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
// @ts-expect-error -- we reach into internals of jest-image-snapshot here, no typings are available for that
import * as jestImageSnapshot from 'jest-image-snapshot/src/diff-snapshot';
import path from 'path';
import pkgDir from 'pkg-dir';
import { MATCH, RECORD } from './constants';
import {
  DiffImageToSnapshot,
  DiffImageToSnapshotResult,
  MatchTaskOptions,
} from './types';

const diffImageToSnapshot =
  jestImageSnapshot.diffImageToSnapshot as DiffImageToSnapshot;

let snapshotOptions: undefined | MatchTaskOptions;
let snapshotResult: undefined | DiffImageToSnapshotResult;
let snapshotRunning = false;
const kebabSnap = '-snap.png';
const dotSnap = '.snap.png';
const dotDiff = '.diff.png';

const packageJsonPath = pkgDir.sync(process.cwd());
if (!packageJsonPath) {
  throw new Error(
    `could not determine path of package.json (and thus, of the cypress .snapshot-report directory)`
  );
}

export const cachePath = path.join(
  packageJsonPath,
  'cypress',
  '.snapshot-report'
);

function matchImageSnapshotStart(options?: MatchTaskOptions) {
  snapshotOptions = options;
  snapshotRunning = true;
  return null;
}

function matchImageSnapshotEnd() {
  snapshotRunning = false;

  if (!snapshotResult) {
    throw new Error(`no snapshotResult is set`);
  }

  const { pass, added, updated } = snapshotResult;

  // @todo is there a less expensive way to share state between test and reporter?
  if (!pass && !added && !updated && fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    cache.push(snapshotResult);
    fs.writeFileSync(cachePath, JSON.stringify(cache), 'utf8');
  }

  return snapshotResult;
}

function matchImageSnapshotPlugin(
  cypressScreenshotDetails: Cypress.ScreenshotDetails
): void | Cypress.AfterScreenshotReturnObject {
  if (!snapshotRunning) {
    return;
  }

  if (!snapshotOptions) {
    throw new Error(`no snapshotOptions are set`);
  }

  const {
    snapshotFolder,
    updateSnapshots,
    options: {
      failureThreshold = 0,
      failureThresholdType = 'pixel',
      ...options
    } = {},
  } = snapshotOptions;

  const receivedImageBuffer = fs.readFileSync(cypressScreenshotDetails.path);
  fs.removeSync(cypressScreenshotDetails.path);

  const { name } = path.parse(cypressScreenshotDetails.path);

  // remove the cypress v5+ native retries suffix from the file name
  const snapshotIdentifier = name.replace(/ \(attempt [0-9]+\)/, '');

  const snapshotKebabPath = path.join(
    snapshotFolder,
    `${snapshotIdentifier}${kebabSnap}`
  );
  const snapshotDotPath = path.join(
    snapshotFolder,
    `${snapshotIdentifier}${dotSnap}`
  );

  const diffDir = path.join(snapshotFolder, '__diff_output__');
  const diffDotPath = path.join(diffDir, `${snapshotIdentifier}${dotDiff}`);

  if (fs.pathExistsSync(snapshotDotPath)) {
    fs.copySync(snapshotDotPath, snapshotKebabPath);
  }

  snapshotResult = diffImageToSnapshot({
    snapshotsDir: snapshotFolder,
    diffDir,
    receivedImageBuffer,
    snapshotIdentifier,
    failureThreshold,
    failureThresholdType,
    updateSnapshot: updateSnapshots,
    ...options,
  });

  const { pass, added, updated, diffOutputPath } = snapshotResult;

  if (!pass && !added && !updated) {
    fs.copySync(diffOutputPath, diffDotPath);
    fs.removeSync(diffOutputPath);
    fs.removeSync(snapshotKebabPath);
    snapshotResult.diffOutputPath = diffDotPath;

    return {
      path: diffDotPath,
    };
  }

  fs.copySync(snapshotKebabPath, snapshotDotPath);
  fs.removeSync(snapshotKebabPath);
  snapshotResult.diffOutputPath = snapshotDotPath;

  return {
    path: snapshotDotPath,
  };
}

export function addMatchImageSnapshotPlugin(
  on: Cypress.PluginEvents,
  _1: unknown
) {
  on('task', {
    [MATCH]: matchImageSnapshotStart,
    [RECORD]: matchImageSnapshotEnd,
  });
  on('after:screenshot', matchImageSnapshotPlugin);
}
