import { type PathSegments } from '../../../../types/segments/path-segments.js';
import {
  getBasenameOfPathSegment,
  type GetBasenameOfPathSegmentOptions,
} from '../../segment/functions/get/get-basename-of-path-segment.js';

export interface GetBasenameOfPathSegmentsOptions extends GetBasenameOfPathSegmentOptions {}

/**
 * Returns the basename of `segments`.
 */
export function getBasenameOfPathSegments(
  segments: PathSegments,
  ext: string | undefined,
  options: GetBasenameOfPathSegmentsOptions,
): string | null {
  return getBasenameOfPathSegment(segments[segments.length - 1], ext, options);
}
