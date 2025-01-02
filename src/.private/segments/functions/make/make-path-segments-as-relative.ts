import type { MutablePathSegments } from '../../../../types/segments/mutable-path-segments.js';
import type { PathSegments } from '../../../../types/segments/path-segments.js';
import {
  forcePathSegmentsAsRelative,
  type ForcePathSegmentsAsRelativeOptions,
} from '../mutate/force-path-segments-as-relative.js';

export interface MakePathSegmentsAsRelativeOptions extends ForcePathSegmentsAsRelativeOptions {}

/**
 * @see forcePathSegmentsAsRelative
 */
export function makePathSegmentsAsRelative(
  segments: PathSegments,
  options: MakePathSegmentsAsRelativeOptions,
): PathSegments {
  const _segments: MutablePathSegments = segments.slice();
  forcePathSegmentsAsRelative(_segments, options);
  return _segments;
}
