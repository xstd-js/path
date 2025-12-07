import { type UncheckedPathSegment } from '../../../../../types/segments/segment/unchecked-path-segment.js';

/**
 * Returns true if 'segment' is a root segment.
 */
export function isRootPathSegment(segment: UncheckedPathSegment, rootRegExp: RegExp): boolean {
  return rootRegExp.test(segment);
}
