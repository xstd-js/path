import type { PathSegments } from '../../../../types/segments/path-segments.js';

/**
 * Returns `true` if `segmentsA` and `segmentB` are equivalent.
 */
export function arePathSegmentsEquivalent(
  segmentsA: PathSegments,
  segmentB: PathSegments,
): boolean {
  const length: number = segmentsA.length;
  if (segmentB.length === length) {
    for (let i: number = 0; i < length; i++) {
      if (segmentsA[i] !== segmentB[i]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
