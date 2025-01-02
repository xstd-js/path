import { build } from './build.js';
import { publish } from './publish.js';

/**
 * Builds the lib.
 * @param {{ mode?: 'dev' | 'rc' | 'prod' }} options
 * @return {Promise<void>}
 */
export async function buildAndPublish(options) {
  await build(options);
  await publish(options);
}
