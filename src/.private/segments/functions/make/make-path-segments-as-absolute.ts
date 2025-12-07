import { type MutablePathSegments } from '../../../../types/segments/mutable-path-segments.js';
import { type PathSegments } from '../../../../types/segments/path-segments.js';
import { type PathSegment } from '../../../../types/segments/segment/path-segment.js';
import {
  forcePathSegmentsAsAbsolute,
  type ForcePathSegmentsAsAbsoluteOptions,
} from '../mutate/force-path-segments-as-absolute.js';

export interface MakePathSegmentsAsAbsoluteOptions extends ForcePathSegmentsAsAbsoluteOptions {}

/**
 * @see forcePathSegmentsAsAbsolute
 */
export function makePathSegmentsAsAbsolute(
  segments: PathSegments,
  rootSegment: PathSegment,
  options: MakePathSegmentsAsAbsoluteOptions,
): PathSegments {
  const _segments: MutablePathSegments = segments.slice();
  forcePathSegmentsAsAbsolute(_segments, rootSegment, options);
  return _segments;
}
