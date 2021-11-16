/* eslint-disable no-console -- the reporter should interact with the console per-design */
import fs from 'fs-extra';
import termImage from 'term-img';
import chalk from 'chalk';
import { cachePath } from './plugin';
import { DiffImageToSnapshotResult } from './types';

function fallback() {
  // do nothing
}

function reporter(runner: any) {
  fs.writeFileSync(cachePath, JSON.stringify([]), 'utf8');

  runner.on('end', () => {
    const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    if (cache.length) {
      console.log(chalk.red(`\n  (${chalk.underline.bold('Snapshot Diffs')})`));

      cache.forEach(
        ({
          diffRatio,
          diffPixelCount,
          diffOutputPath,
        }: DiffImageToSnapshotResult) => {
          console.log(
            `\n  - ${diffOutputPath}\n    Screenshot was ${
              diffRatio * 100
            }% different from saved snapshot with ${diffPixelCount} different pixels.\n`
          );
          termImage(diffOutputPath, { fallback });
        }
      );
    }

    fs.removeSync(cachePath);
  });
}

module.exports = reporter;
