import type { PathSegments } from '../../../../types/segments/path-segments.js';
import { isRelativePathSegment } from '../../segment/functions/is/is-relative-path-segement.js';
import type { GetProcessPathSegmentsOptions } from '../get/get-process-path-segments.js';
import type { IsAbsolutePathSegmentsOptions } from '../is/is-absolute-path-segments.js';
import { joinManyPathSegments } from '../join/join-many-path-segments.js';

export interface ResolvePathSegmentsOptions
  extends GetProcessPathSegmentsOptions,
    IsAbsolutePathSegmentsOptions {}

/**
 * Converts a path to an absolute path
 * INFO: root must be an absolute path
 */
export function resolvePathSegments(
  segments: PathSegments,
  root: PathSegments,
  options: ResolvePathSegmentsOptions,
): PathSegments {
  if (isRelativePathSegment(segments[0])) {
    return joinManyPathSegments([root, segments], options);
  } else {
    return segments.slice();
  }
}
