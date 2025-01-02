import type { PathSegments } from '../../../../types/segments/path-segments.js';
import type { PathSegment } from '../../../../types/segments/segment/path-segment.js';

/**
 * Returns true if the path contains only `..`.
 */
export function isPureParentDirectoryPathSegments(segments: PathSegments): boolean {
  return segments.every((segment: PathSegment): boolean => segment === '..');
}
