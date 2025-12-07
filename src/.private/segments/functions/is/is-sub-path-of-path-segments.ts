import { type PathSegments } from '../../../../types/segments/path-segments.js';

/**
 * Returns true if `path` is a sub-path of `parentPath` or equals it (if `equals` is true)
 *
 * @example:
 *  `isSubPathOfPathSegments('/a/b/c', '/a/b/c/d')` => `false`
 *  `isSubPathOfPathSegments('/a/b/c/d', '/a/b/c')` => `true`
 */
export function isSubPathOfPathSegments(path: PathSegments, parentPath: PathSegments): boolean {
  if (parentPath.length >= path.length) {
    return false;
  } else {
    for (let i: number = 0, l: number = parentPath.length; i < l; i++) {
      if (path[i] !== parentPath[i]) {
        return false;
      }
    }
    return true;
  }
}
