import type { MutablePathSegments } from '../../../../types/segments/mutable-path-segments.js';
import type { UncheckedPathSegment } from '../../../../types/segments/segment/unchecked-path-segment.js';
import { isValidPathSegment } from '../../segment/functions/is/is-valid-path-segement.js';
import {
  pushSegmentIntoMutablePathSegments,
  type PushSegmentIntoMutablePathSegmentsOptions,
} from './push-segment-into-mutable-path-segments.js';

export interface PushUncheckedSegmentIntoMutablePathSegmentsOptions
  extends PushSegmentIntoMutablePathSegmentsOptions {
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
  if (isValidPathSegment(segment, options.invalidPathSegmentRegExp)) {
    return pushSegmentIntoMutablePathSegments(segments, segment, options);
  } else {
    throw new Error(`Segment ${JSON.stringify(segment)} is invalid`);
  }
}
