import type { PathSegment } from '../../../../../types/segments/segment/path-segment.js';
import type { SpecialSegmentsAllowedForBasename } from '../../../../../types/segments/special-segments-allowed-for-basename.js';
import { isRelativePathSegment } from '../is/is-relative-path-segement.js';
import { isRootPathSegment } from '../is/is-root-path-segement.js';
import { getBasenameOfEntryPathSegment } from './get-basename-of-entry-path-segment.js';

export const DEFAULT_SPECIAL_SEGMENTS_ALLOWED_FOR_BASENAME: Set<SpecialSegmentsAllowedForBasename> =
  new Set<SpecialSegmentsAllowedForBasename>();

export interface GetBasenameOfPathSegmentOptions {
  readonly rootRegExp: RegExp;
  readonly allowedSpecialSegments?: Set<SpecialSegmentsAllowedForBasename>;
}

/**
 * Returns the basename of a segment, without 'ext' if provided
 *  - returns null if segment is special (relative or root) and options.allowedSpecialSegments doesn't include it
 * INFO: 'basename' must be a valid entry, including relative and root
 */
export function getBasenameOfPathSegment(
  segment: PathSegment,
  ext: string | undefined,
  {
    rootRegExp,
    allowedSpecialSegments = DEFAULT_SPECIAL_SEGMENTS_ALLOWED_FOR_BASENAME,
  }: GetBasenameOfPathSegmentOptions,
): string | null {
  if (isRelativePathSegment(segment)) {
    return allowedSpecialSegments.has(segment as '.' | '..') ? segment : null;
  } else if (isRootPathSegment(segment, rootRegExp)) {
    return allowedSpecialSegments.has('root') ? (segment === '' ? '/' : '') : null;
  } else {
    return getBasenameOfEntryPathSegment(segment, ext);
  }
}
