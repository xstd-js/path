import type { PathSegments } from '../../../../types/segments/path-segments.js';
import { convertStringPathToUncheckedPathSegments } from './convert-string-path-to-unchecked-path-segments.js';
import {
  convertUncheckedPathSegmentsIntoPathSegments,
  type ConvertUncheckedPathSegmentsIntoPathSegments,
} from './convert-unchecked-path-segments-into-path-segments.js';

export interface IConvertStringPathToPathSegmentsOptions
  extends ConvertUncheckedPathSegmentsIntoPathSegments {}

/**
 * Converts a string path to some `PathSegments`.
 */
export function convertStringPathToPathSegments(
  path: string,
  options: IConvertStringPathToPathSegmentsOptions,
): PathSegments {
  return convertUncheckedPathSegmentsIntoPathSegments(
    convertStringPathToUncheckedPathSegments(path, options),
    options,
  );
}
