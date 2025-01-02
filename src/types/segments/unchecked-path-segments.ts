import type { UncheckedPathSegment } from './segment/unchecked-path-segment.js';

/**
 * IPathSegments, but this one could be invalid
 */
export type UncheckedPathSegments = readonly UncheckedPathSegment[];
