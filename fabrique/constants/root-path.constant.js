import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT_PATH = join(fileURLToPath(import.meta.url), '../../..');
