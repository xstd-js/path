import { describe, expect, it, vi } from 'vitest';
import { getCommonBaseOfManyPathSegments } from '../.private/segments/functions/get/get-common-base-of-many-path-segments.js';
import { joinManyPathSegments } from '../.private/segments/functions/join/join-many-path-segments.js';
import { forcePathSegmentsAsAbsolute } from '../.private/segments/functions/mutate/force-path-segments-as-absolute.js';
import { pushSegmentIntoMutablePathSegments } from '../.private/segments/functions/mutate/push-segment-into-mutable-path-segments.js';
import { Path } from './path.js';

describe('Path', () => {
  function mockProcess<GReturn>(process: any, cb: () => GReturn): GReturn {
    vi.spyOn(globalThis, 'process', 'get').mockReturnValue(process);
    try {
      return cb();
    } finally {
      vi.restoreAllMocks();
    }
  }

  function emulateWindowsEnvironment<GReturn>(cb: () => GReturn): GReturn {
    if (process.platform === 'win32') {
      return cb();
    } else {
      return mockProcess({ platform: 'win32' }, cb);
    }
  }

  function emulateLinuxEnvironment<GReturn>(cb: () => GReturn): GReturn {
    if (process.platform === 'linux') {
      return cb();
    } else {
      return mockProcess({ platform: 'linux' }, cb);
    }
  }

  describe('constructor', () => {
    it('should accept string', () => {
      expect(new Path('abc').toString()).toBe('./abc');
      expect(new Path('').toString()).toBe('.');
    });

    it('should accept array of strings', () => {
      expect(new Path(['a', 'b']).toString()).toBe('./a/b');
    });

    it('should accept another Path', () => {
      expect(new Path(new Path(['abc'])).toString()).toBe('./abc');
    });

    it('should throw if "path" has invalid type', () => {
      expect(() => new Path(1 as any)).toThrow();
    });

    it('should throw if path is invalid', () => {
      expect(() => new Path('><')).toThrow();
      expect(() => new Path('/a/h/g"/')).toThrow();
      expect(() => new Path('c:a')).toThrow();
    });

    it('should accept object as config', () => {
      expect(new Path('abc', { ...Path.posix })).toBeDefined();
    });

    it('should throw if "config" has invalid type', () => {
      expect(() => new Path('abc', 1 as any)).toThrow();
    });
  });

  describe('static', () => {
    describe('properties', () => {
      describe('posix', () => {
        it('should be defined', () => {
          expect(Path.posix).toBeDefined();
        });
      });

      describe('windows', () => {
        it('should be defined', () => {
          expect(Path.windows).toBeDefined();
        });
      });

      describe('generic', () => {
        it('should be defined', () => {
          expect(Path.generic).toBeDefined();
        });
      });

      describe('currentPlatform', () => {
        it('should support windows', () => {
          emulateWindowsEnvironment(() => {
            expect(Path.currentPlatform.separator).toBe('\\');
          });
        });

        it('should support linux', () => {
          emulateLinuxEnvironment(() => {
            expect(Path.currentPlatform.separator).toBe('/');
          });
        });
      });
    });

    describe('methods', () => {
      describe('process', () => {
        it('should be defined', () => {
          expect(Path.process()).toBeDefined();
        });

        it('should not be defined on browser', () => {
          vi.spyOn(globalThis, 'process', 'get').mockReturnValue(undefined as any);
          expect(() => Path.process()).toThrow();
          vi.restoreAllMocks();
        });
      });

      describe('of', () => {
        it('should return same path if input is a Path', () => {
          const path = new Path('abc');
          expect(Path.of(path)).toBe(path);
        });
      });
    });
  });

  describe('methods', () => {
    describe('isAbsolute', () => {
      it('should return true with windows root', () => {
        expect(new Path('c:').isAbsolute()).toBe(true);
        expect(new Path('c:/').isAbsolute()).toBe(true);
        expect(new Path('c:\\').isAbsolute()).toBe(true);
        expect(new Path('c:/a/').isAbsolute()).toBe(true);
      });

      it('should return true with windows network root', () => {
        expect(new Path('\\\\network\\g').isAbsolute()).toBe(true);
      });

      it('should return true with posix root', () => {
        expect(new Path('/').isAbsolute()).toBe(true);
        expect(new Path('/a').isAbsolute()).toBe(true);
      });

      it('should return false with relative path', () => {
        expect(new Path('a').isAbsolute()).toBe(false);
        expect(new Path('.').isAbsolute()).toBe(false);
        expect(new Path('..').isAbsolute()).toBe(false);
      });
    });

    describe('isRoot', () => {
      it('should return true with windows root', () => {
        expect(new Path('c:').isRoot()).toBe(true);
        expect(new Path('c:/').isRoot()).toBe(true);
        expect(new Path('c:\\').isRoot()).toBe(true);
      });

      it('should return false with windows non root path', () => {
        expect(new Path('c:/a/').isRoot()).toBe(false);
      });

      it('should return true with windows network root', () => {
        expect(new Path('\\\\network\\g').isRoot()).toBe(false);
      });

      it('should return false with windows non root network path', () => {
        expect(new Path('\\\\network\\g').isRoot()).toBe(false);
      });

      it('should return true with posix root', () => {
        expect(new Path('/').isRoot()).toBe(true);
      });

      it('should return true with posix non root path', () => {
        expect(new Path('/a').isRoot()).toBe(false);
      });

      it('should return false with relative path', () => {
        expect(new Path('a').isRoot()).toBe(false);
        expect(new Path('.').isRoot()).toBe(false);
        expect(new Path('..').isRoot()).toBe(false);
      });
    });

    describe('isSubPathOf', () => {
      it('should works', () => {
        expect(new Path('a/b/').isSubPathOf('a/')).toBe(true);
        expect(new Path('/a/b/').isSubPathOf('a/')).toBe(false);
        expect(new Path('a/b/').isSubPathOf('a/c')).toBe(false);
      });
    });

    describe('equals', () => {
      it('should be true for identical paths', () => {
        expect(new Path('/').equals('/')).toBe(true);
      });

      it('should be true for identical normalized paths', () => {
        expect(new Path('/a/b/../c').equals('/a/c')).toBe(true);
      });

      it('should be false for different paths', () => {
        expect(new Path('/a/c').equals('/a/b')).toBe(false);
        expect(new Path('/a/b/c').equals('/a/b')).toBe(false);
      });
    });

    describe('dirname', () => {
      it('should throw with a root', () => {
        expect(() => new Path('/').dirname()).toThrow();
      });

      it('should return null with a root and optional', () => {
        expect(new Path('/').dirnameOptional()).toBe(null);
      });

      it('should works with absolute path', () => {
        expect(new Path('/a').dirname().toString()).toBe('/');
      });

      it('should works with relative path', () => {
        expect(new Path('a/b').dirname().toString()).toBe('./a');
        expect(new Path('./a/b/c').dirname().toString()).toBe('./a/b');
        expect(new Path('.').dirname().toString()).toBe('..');
        expect(new Path('..').dirname().toString()).toBe('../..');
      });
    });

    describe('basename', () => {
      it('should throw with a root', () => {
        expect(() => new Path('/').basename()).toThrow();
      });

      it('should return null with a root and optional', () => {
        expect(new Path('/').basenameOptional()).toBe(null);
      });

      it('should not throw with a root with proper allowedSpecialSegments', () => {
        expect(new Path('/').basename(void 0, ['root'])).toBe('/');
        expect(new Path('c:\\').basename(void 0, ['root'])).toBe('');
      });

      it('should works with absolute path', () => {
        expect(new Path('/a').basename()).toBe('a');
      });

      it('should works with relative path', () => {
        expect(new Path('a/b').basename()).toBe('b');
      });

      it('should works with ".." path and allowed', () => {
        expect(new Path('..').basename(undefined, ['..'])).toBe('..');

        expect(() => new Path('..').basename()).toThrow('..');
      });

      it('should support "ext"', () => {
        expect(new Path('a.txt').basename('.txt')).toBe('a');
      });
    });

    describe('stemAndExt', () => {
      it('should throw with a root', () => {
        expect(() => new Path('/').stemAndExt()).toThrow();
      });

      it('should return expected values', () => {
        expect(new Path('a.b').stemAndExt()).toEqual({ stem: 'a', ext: '.b' });
        expect(new Path('a.b.c').stemAndExt()).toEqual({ stem: 'a.b', ext: '.c' });
        expect(new Path('a.').stemAndExt()).toEqual({ stem: 'a', ext: '.' });
        expect(new Path('a').stemAndExt()).toEqual({ stem: 'a', ext: '' });
        expect(new Path('.a').stemAndExt()).toEqual({ stem: '.a', ext: '' });
      });
    });

    describe('commonBase', () => {
      it('should throw if no common base', () => {
        expect(() => new Path('/a/b/').commonBase('a/c')).toThrow();
      });

      it('should return expected values', () => {
        expect(new Path('a/./b/').commonBase('./a/b').toString()).toBe('./a/b');
        expect(new Path('a/b/').commonBase('a/c').toString()).toBe('./a');
        expect(new Path('/a/b/').commonBase('/a/c').toString()).toBe('/a');
        expect(new Path('a/b').commonBase('c/d').toString()).toBe('.');
        expect(new Path('/a/b').commonBase('/c/d').toString()).toBe('/');
      });

      it('should support empty arguments', () => {
        expect(new Path('/a/b').commonBase().toString()).toBe('/a/b');
      });

      it('should support multiple arguments', () => {
        expect(new Path('/a/b').commonBase('/a/c', '/a/d').toString()).toBe('/a');
      });

      it('should throw if 0 path segments where provided', () => {
        expect(() => getCommonBaseOfManyPathSegments([])).toThrow();
      });
    });

    describe('relative', () => {
      it('should throw if not relative', () => {
        expect(() => new Path('a/b/').relative('/a/d')).toThrow();
        expect(() => new Path('/a/b').relative('./a')).toThrow();
      });

      it('should return expected values', () => {
        expect(new Path('a/b/').relative('a/d').toString()).toBe('../d');
        expect(new Path('a/b/').relative('c/d').toString()).toBe('../../c/d');
        expect(new Path('a/').relative('a/').toString()).toBe('.');
        expect(new Path('/a/b').relative('/a/c').toString()).toBe('../c');
        expect(new Path('/').relative('/d/e').toString()).toBe('./d/e');
      });
    });

    describe('concat', () => {
      it('should throw if not possible', () => {
        expect(() => new Path('/a/b/').concat('/c/d')).toThrow();
      });

      it('should return expected values', () => {
        expect(new Path('a/b/').concat('c/d').toString()).toBe('./a/b/c/d');
        expect(new Path('a/b/').concat('c/d').toString()).toBe('./a/b/c/d');
        expect(new Path('/').concat('c/d').toString()).toBe('/c/d');
      });

      it('should throw if 0 path segments where provided', () => {
        expect(() => joinManyPathSegments([], Path.posix)).toThrow();
      });

      it('should support "non-strict" mode', () => {
        expect(
          joinManyPathSegments(
            [
              ['', 'a'],
              ['', 'b'],
            ],
            {
              ...Path.posix,
              strict: false,
            },
          ),
        ).toEqual(['', 'a', 'b']);
      });

      it('should throw when trying to push a root', () => {
        expect(() => pushSegmentIntoMutablePathSegments(['', 'a'], '', Path.posix)).toThrow();
      });
    });

    describe('resolve', () => {
      it('should throw in case of invalid root', () => {
        expect(() => new Path('/a/b/').resolve('a')).toThrow();
      });

      it('should return expected values', () => {
        expect(new Path('a').resolve('c:').toString()).toBe('c:/a');
        expect(new Path('b:/a').resolve('c:').toString()).toBe('b:/a');
      });

      it('should support undefined root', () => {
        expect(new Path('/a/b').resolve().toString()).toBe('/a/b');
      });
    });

    describe('clone', () => {
      it('should return the same path', () => {
        expect(new Path('/a/b').clone().toString()).toBe('/a/b');
      });
    });

    describe('makeRelative', () => {
      it('should return expected values', () => {
        expect(new Path('/').makeRelative().toString()).toBe('.');
        expect(new Path('/a').makeRelative().toString()).toBe('./a');
        expect(new Path('c:/a').makeRelative().toString()).toBe('./a');
        expect(new Path('a').makeRelative().toString()).toBe('./a');
      });
    });

    describe('makeAbsolute', () => {
      it('should return expected values', () => {
        expect(new Path('/').makeAbsolute('/').toString()).toBe('/');
        expect(new Path('./a').makeAbsolute('/').toString()).toBe('/a');
        expect(new Path('../../a').makeAbsolute('/').toString()).toBe('/a');
      });

      it('should support undefined root', () => {
        expect(new Path('/').makeAbsolute().toString()).toBe('/');
      });

      it('should throw if an invalid root is provided', () => {
        expect(() => new Path('a').makeAbsolute('b').toString()).toThrow();
      });

      it('should throw if an invalid path is provided', () => {
        expect(() => forcePathSegmentsAsAbsolute(['a'], '', Path.posix)).toThrow();
      });
    });

    describe('toString', () => {
      it('should return expected values', () => {
        expect(new Path('a/b/').toString()).toBe('./a/b');
        expect(new Path('/a/b/').toString()).toBe('/a/b');
        expect(() => new Path('/a/../../').toString()).toThrow();
        expect(new Path('./a/b/').toString()).toBe('./a/b');
        expect(new Path('../a/b/').toString()).toBe('../a/b');
        expect(new Path('a/b/..').toString()).toBe('./a');
        expect(new Path('a/b/../..').toString()).toBe('.');
        expect(new Path('a/./b/').toString()).toBe('./a/b');
        expect(new Path('/').toString()).toBe('/');
        expect(new Path('c:/').toString()).toBe('c:/');
        expect(new Path('C:/').toString()).toBe('C:/');
        expect(new Path('c:\\a').toString()).toBe('c:/a');
        expect(new Path('\\\\network\\a').toString()).toBe('\\\\network/a');
        expect(new Path('../../').toString()).toBe('../..');
      });

      it('should support custom separator', () => {
        expect(new Path('a/b').toString('\\')).toBe('.\\a\\b');
      });

      it('should throw if "separator" has invalid type', () => {
        expect(() => new Path('a/b').toString(1 as any)).toThrow();
      });
    });

    describe('toURL', () => {
      it('should return expected values', () => {
        expect(new Path('/a/b').toURL().toString()).toBe('file:///a/b');
      });
    });
  });
});
