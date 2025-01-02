import { Path } from '../path.js';

export function isPath(value: unknown): value is Path {
  return value instanceof Path;
}
