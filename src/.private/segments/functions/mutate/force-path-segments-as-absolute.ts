import { type MutablePathSegments } from '../../../../types/segments/mutable-path-segments.js';
import { type PathSegment } from '../../../../types/segments/segment/path-segment.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';

export interface ForcePathSegmentsAsAbsoluteOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Converts a relative path to an absolute path, by appending `rootSegment` at the beginning of the path.
 */
export function forcePathSegmentsAsAbsolute(
  segments: MutablePathSegments,
  rootSegment: PathSegment,
  { rootRegExp }: ForcePathSegmentsAsAbsoluteOptions,
): void {
  if (isRootPathSegment(rootSegment, rootRegExp)) {
    const firstSegment: PathSegment = segments[0];
    if (firstSegment === '.') {
      segments[0] = rootSegment;
    } else if (firstSegment === '..') {
      while (segments[0] === '..') {
        segments.shift();
      }
      segments.unshift(rootSegment);
    } else if (isRootPathSegment(firstSegment, rootRegExp)) {
      // do nothing
    } else {
      throw new Error('Path is not normalized');
    }
  } else {
    throw new Error('Root is invalid');
  }
}
