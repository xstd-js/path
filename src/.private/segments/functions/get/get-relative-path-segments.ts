import { type MutablePathSegments } from '../../../../types/segments/mutable-path-segments.js';
import { type PathSegments } from '../../../../types/segments/path-segments.js';
import {
  pushSegmentIntoMutablePathSegments,
  type PushSegmentIntoMutablePathSegmentsOptions,
} from '../mutate/push-segment-into-mutable-path-segments.js';
import { getCommonBaseOfManyPathSegments } from './get-common-base-of-many-path-segments.js';

export interface GetRelativePathSegmentsOptions extends PushSegmentIntoMutablePathSegmentsOptions {}

/**
 * Returns the relative `PathSegments` between `from` and `to`:
 *  - if no common base path => `[]`
 *  - else `['..' | '.', ...]`
 */
export function getRelativePathSegments(
  from: PathSegments,
  to: PathSegments,
  options: GetRelativePathSegmentsOptions,
): PathSegments | null {
  const commonBase: PathSegments | null = getCommonBaseOfManyPathSegments([from, to]);
  if (commonBase === null) {
    return null;
  } else {
    const relativePath: MutablePathSegments = ['.'];
    for (let i: number = commonBase.length; i < from.length; i++) {
      pushSegmentIntoMutablePathSegments(relativePath, '..', options);
    }
    for (let i: number = commonBase.length; i < to.length; i++) {
      pushSegmentIntoMutablePathSegments(relativePath, to[i], options);
    }
    return relativePath;
  }
}
