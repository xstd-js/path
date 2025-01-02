import type { PathSegments } from '../../../../types/segments/path-segments.js';
import { getProcess } from '../../../functions/get-process.js';
import {
  convertStringPathToPathSegments,
  type IConvertStringPathToPathSegmentsOptions,
} from '../convert/convert-string-path-to-path-segments.js';

export interface GetProcessPathSegmentsOptions extends IConvertStringPathToPathSegmentsOptions {}

/**
 * Returns the `IPathSegments` of the current process.
 */
export function getProcessPathSegments(options: GetProcessPathSegmentsOptions): PathSegments {
  return convertStringPathToPathSegments(getProcess().cwd(), options);
}
