import { type PathSegments } from '../../../../types/segments/path-segments.js';
import { type StemAndExtTuple } from '../../../../types/stem-and-ext-tuple.js';
import { getStemAndExtEntryPathSegment } from '../../segment/functions/get/get-stem-and-ext-entry-path-segment.js';
import { getBasenameOfPathSegments } from './get-basename-of-path-segments.js';

export interface GetStemAndExtOfPathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

/**
 *  Returns the stem and ext tuple of the basename of 'segments'
 */
export function getStemAndExtOfPathSegments(
  segments: PathSegments,
  { rootRegExp }: GetStemAndExtOfPathSegmentsOptions,
): StemAndExtTuple | null {
  const basename: string | null = getBasenameOfPathSegments(segments, undefined, {
    rootRegExp,
  });

  return basename === null ? null : getStemAndExtEntryPathSegment(basename);
}
