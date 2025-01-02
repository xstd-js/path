import type { UncheckedPathSegment } from '../../../../../types/segments/segment/unchecked-path-segment.js';

/**
 * Returns true if 'segment' is a relative segment
 */
export function isRelativePathSegment(segment: UncheckedPathSegment): boolean {
  return segment === '.' || segment === '..';
}
