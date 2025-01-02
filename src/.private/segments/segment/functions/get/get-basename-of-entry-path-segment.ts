import type { PathSegment } from '../../../../../types/segments/segment/path-segment.js';

/**
 * Returns the basename of a segment, without 'ext' if provided
 * INFO: 'basename' must be a valid entry name (must not be root or relative)
 */
export function getBasenameOfEntryPathSegment(segment: PathSegment, ext: string = ''): string {
  return ext !== '' && segment.endsWith(ext) ? segment.slice(0, -ext.length) : segment;
}
