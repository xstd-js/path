import type { UncheckedPathSegments } from '../../../../types/segments/unchecked-path-segments.js';
import { SLASH_REGEXP } from '../../../platform-config/constants/slash-regexp.constant.js';

export interface ConvertStringPathToUncheckedPathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Converts a string path to an `UncheckedPathSegments`.
 */
export function convertStringPathToUncheckedPathSegments(
  path: string,
  { rootRegExp }: ConvertStringPathToUncheckedPathSegmentsOptions,
): UncheckedPathSegments {
  if (path === '') {
    return [];
  } else {
    rootRegExp.lastIndex = 0;
    const match: RegExpExecArray | null = rootRegExp.exec(path);

    if (match === null) {
      return path.split(SLASH_REGEXP);
    } else {
      path = path.slice(match[0].length);
      return [match[1], ...path.split(SLASH_REGEXP)];
    }
  }
}
