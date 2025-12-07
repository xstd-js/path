import { type MutablePathSegments } from '../../../../types/segments/mutable-path-segments.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';

export interface ForcePathSegmentsAsRelativeOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Converts an absolute path to a relative path: replace the root by `.`.
 */
export function forcePathSegmentsAsRelative(
  segments: MutablePathSegments,
  { rootRegExp }: ForcePathSegmentsAsRelativeOptions,
): void {
  if (isRootPathSegment(segments[0], rootRegExp)) {
    segments[0] = '.';
  }
}
