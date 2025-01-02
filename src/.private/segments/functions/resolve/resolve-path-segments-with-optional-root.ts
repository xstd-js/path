import type { PathSegments } from '../../../../types/segments/path-segments.js';
import {
  getProcessPathSegments,
  type GetProcessPathSegmentsOptions,
} from '../get/get-process-path-segments.js';
import {
  isAbsolutePathSegments,
  type IsAbsolutePathSegmentsOptions,
} from '../is/is-absolute-path-segments.js';
import { resolvePathSegments, type ResolvePathSegmentsOptions } from './resolve-path-segments.js';

export interface ResolvePathSegmentsWithOptionalRootOptions
  extends GetProcessPathSegmentsOptions,
    IsAbsolutePathSegmentsOptions,
    ResolvePathSegmentsOptions {}

/**
 * Converts a path to an absolute path
 */
export function resolvePathSegmentsWithOptionalRoot(
  segments: PathSegments,
  root: PathSegments | undefined,
  options: ResolvePathSegmentsWithOptionalRootOptions,
): PathSegments {
  if (root === undefined) {
    root = getProcessPathSegments(options);
  }

  if (isAbsolutePathSegments(root, options)) {
    return resolvePathSegments(segments, root, options);
  } else {
    throw new Error("Argument 'root' is not a valid root");
  }
}
