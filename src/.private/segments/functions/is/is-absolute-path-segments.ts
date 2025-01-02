import type { PathSegments } from '../../../../types/segments/path-segments.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';

export interface IsAbsolutePathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Returns `true` if the path is absolute.
 */
export function isAbsolutePathSegments(
  segments: PathSegments,
  { rootRegExp }: IsAbsolutePathSegmentsOptions,
): boolean {
  return isRootPathSegment(segments[0], rootRegExp);
}
