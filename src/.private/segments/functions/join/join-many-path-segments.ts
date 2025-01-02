import type { MutablePathSegments } from '../../../../types/segments/mutable-path-segments.js';
import type { PathSegments } from '../../../../types/segments/path-segments.js';
import {
  isAbsolutePathSegments,
  type IsAbsolutePathSegmentsOptions,
} from '../is/is-absolute-path-segments.js';
import { pushSegmentIntoMutablePathSegments } from '../mutate/push-segment-into-mutable-path-segments.js';

export interface IJoinManyPathSegmentsOptions extends IsAbsolutePathSegmentsOptions {
  readonly strict?: boolean;
}

/**
 * Joins many PathSegments
 *  - pretty close to convertUncheckedPathSegmentsIntoPathSegments(['a'].concat(['b']))
 */
export function joinManyPathSegments(
  paths: readonly PathSegments[],
  { strict = true, ...options }: IJoinManyPathSegmentsOptions,
): PathSegments {
  const pathsLength: number = paths.length;
  if (pathsLength === 0) {
    throw new Error('Expected at least one path');
  } else {
    const joined: MutablePathSegments = paths[0].slice();
    for (let i: number = 1; i < pathsLength; i++) {
      const path: PathSegments = paths[i];
      let j: number = 0;
      if (isAbsolutePathSegments(path, options) && i > 0) {
        if (strict) {
          throw new Error('Only the first path can be absolute.');
        } else {
          j = 1;
        }
      }
      for (; j < path.length; j++) {
        pushSegmentIntoMutablePathSegments(joined, path[j], options);
      }
    }
    return joined;
  }
}
