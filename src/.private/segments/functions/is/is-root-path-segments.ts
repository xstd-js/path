import type { PathSegments } from '../../../../types/segments/path-segments.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';

export interface IsRootPathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

export function isRootPathSegments(
  segments: PathSegments,
  { rootRegExp }: IsRootPathSegmentsOptions,
): boolean {
  return segments.length === 1 && isRootPathSegment(segments[0], rootRegExp);
}
