import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { ROOT_PATH } from '../constants/root-path.constant.js';
import { cmd } from '../helpers/cmd.js';

/**
 * Git tag and push
 * @return {Promise<void>}
 */
export async function gitTag() {
  const packageJsonPath = join(ROOT_PATH, 'package.json');

  const version = JSON.parse(
    await readFile(packageJsonPath, {
      encoding: 'utf8',
    }),
  ).version;

  console.log(`Git tag v${version}...`);

  await cmd('git', ['tag', '-a', `v${version}`, '-m', `release v${version}`], {
    cwd: resolve(ROOT_PATH),
  });
  await cmd('git', ['push', '--tags'], { cwd: resolve(ROOT_PATH) });

  console.log('Tag published with success !');
}
