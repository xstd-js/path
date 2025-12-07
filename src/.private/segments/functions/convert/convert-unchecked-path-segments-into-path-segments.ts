import { type MutablePathSegments } from '../../../../types/segments/mutable-path-segments.js';
import { type PathSegments } from '../../../../types/segments/path-segments.js';
import { type UncheckedPathSegment } from '../../../../types/segments/segment/unchecked-path-segment.js';
import { type UncheckedPathSegments } from '../../../../types/segments/unchecked-path-segments.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';
import {
  pushUncheckedSegmentIntoMutablePathSegments,
  type PushUncheckedSegmentIntoMutablePathSegmentsOptions,
} from '../mutate/push-unchecked-segment-into-mutable-path-segments.js';

export interface ConvertUncheckedPathSegmentsIntoPathSegments extends PushUncheckedSegmentIntoMutablePathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Ensures every segment from `segments` is correct and optimizes the result.
 * See`IPathSegments` for more details.
 */
export function convertUncheckedPathSegmentsIntoPathSegments(
  segments: UncheckedPathSegments,
  options: ConvertUncheckedPathSegmentsIntoPathSegments,
): PathSegments {
  const length: number = segments.length;
  if (length === 0) {
    return ['.'];
  } else {
    const normalized: MutablePathSegments = [];
    const firstSegment: UncheckedPathSegment = segments[0];
    let i: number = 0;
    if (isRootPathSegment(firstSegment, options.rootRegExp)) {
      normalized.push(firstSegment);
      i++;
    } else {
      normalized.push('.');
    }

    for (; i < length; i++) {
      if (segments[i] !== '') {
        // removes ending / or //
        pushUncheckedSegmentIntoMutablePathSegments(normalized, segments[i], options);
      }
    }

    return normalized;
  }
}
