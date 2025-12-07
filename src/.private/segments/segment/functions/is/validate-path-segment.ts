import { type UncheckedPathSegment } from '../../../../../types/segments/segment/unchecked-path-segment.js';
import { isValidPathSegment } from './is-valid-path-segement.js';

export function validatePathSegment(
  segment: UncheckedPathSegment,
  invalidPathSegmentRegExp: RegExp,
): void {
  if (!isValidPathSegment(segment, invalidPathSegmentRegExp)) {
    throw new Error(`Segment ${JSON.stringify(segment)} is invalid`);
  }
}
