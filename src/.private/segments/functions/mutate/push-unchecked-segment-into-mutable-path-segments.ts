import { type MutablePathSegments } from '../../../../types/segments/mutable-path-segments.js';
import { type UncheckedPathSegment } from '../../../../types/segments/segment/unchecked-path-segment.js';
import { validatePathSegment } from '../../segment/functions/is/validate-path-segment.js';
import {
  pushSegmentIntoMutablePathSegments,
  type PushSegmentIntoMutablePathSegmentsOptions,
} from './push-segment-into-mutable-path-segments.js';

export interface PushUncheckedSegmentIntoMutablePathSegmentsOptions extends PushSegmentIntoMutablePathSegmentsOptions {
  readonly invalidPathSegmentRegExp: RegExp;
}

/**
 * @see pushSegmentIntoMutablePathSegments
 */
export function pushUncheckedSegmentIntoMutablePathSegments(
  segments: MutablePathSegments,
  segment: UncheckedPathSegment,
  options: PushUncheckedSegmentIntoMutablePathSegmentsOptions,
): void {
  validatePathSegment(segment, options.invalidPathSegmentRegExp);
  return pushSegmentIntoMutablePathSegments(segments, segment, options);
}
