import { join, resolve } from 'node:path';
import { ROOT_PATH } from '../constants/root-path.constant.js';
import { cmd } from '../helpers/cmd.js';

/**
 * Publishes the lib.
 * @param {{ mode?: 'dev' | 'rc' | 'prod'; }} options
 * @return {Promise<void>}
 */
export async function publish({ mode = 'prod' } = {}) {
  const packagePath = join(ROOT_PATH, 'dist');

  console.log('Publishing library...');

  /**
   * @type {{
   *   quiet?: boolean;
   *   registry?: string;
   *   access?: 'public';
   *   tag?: string;
   * }}
   */
  const options = {};

  /**
   * @type {string[]}
   */
  const args = ['publish'];

  if (mode === 'dev') {
    options.quiet = true;
    options.registry = 'http://localhost:4873';
    options.tag = 'dev';
  } else {
    options.registry = 'https://registry.npmjs.org';
    options.access = 'public';

    if (mode === 'rc') {
      options.tag = 'rc';
    }
  }

  if (options.quiet) {
    args.push('--quiet');
  }

  if (options.registry) {
    args.push('--registry', options.registry);
  }

  if (options.access) {
    args.push('--access', options.access);
  }

  if (options.tag) {
    args.push('--tag', options.tag);
  }

  await cmd('npm', args, { cwd: resolve(packagePath) });

  console.log('Library published with success !');
}
