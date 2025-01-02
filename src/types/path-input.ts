import { Path } from '../class/path.js';
import type { UncheckedPathSegments } from './segments/unchecked-path-segments.js';

/**
 * Various inputs that may serve as a path.
 */
export type PathInput =
  | string // the path as a string
  | UncheckedPathSegments // the path as split segments (kind of .split('/'))
  | Path; // a Path
