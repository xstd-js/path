import type { PathSegment } from '../../../../../types/segments/segment/path-segment.js';
import type { StemAndExtTuple } from '../../../../../types/stem-and-ext-tuple.js';

/**
 * Returns the stem (file name without extension) and extension of 'basename'
 * INFO: 'basename' must not be a special segment (from root or relative)
 */
export function getStemAndExtEntryPathSegment(segment: PathSegment): StemAndExtTuple {
  const index: number = segment.lastIndexOf('.');
  if (index <= 0) {
    // 0 || -1 => segment.startsWith('.') || !segment.includes('.')
    return {
      stem: segment,
      ext: '',
    };
  } else {
    return {
      stem: segment.slice(0, index),
      ext: segment.slice(index),
    };
  }
}
