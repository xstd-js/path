import type { PathSegments } from '../../../../types/segments/path-segments.js';
import { isRootPathSegments, type IsRootPathSegmentsOptions } from '../is/is-root-path-segments.js';

export interface PathSegmentsToStringPathOptions extends IsRootPathSegmentsOptions {
  readonly separator: string;
}

/**
 * Converts some`PathSegments` into a string path.
 */
export function convertPathSegmentsToStringPath(
  segments: PathSegments,
  { separator, ...options }: PathSegmentsToStringPathOptions,
): string {
  return isRootPathSegments(segments, options) ? segments[0] + separator : segments.join(separator);
}
