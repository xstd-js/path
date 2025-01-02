[![npm (scoped)](https://img.shields.io/npm/v/@xstd/path.svg)](https://www.npmjs.com/package/@xstd/path)
![npm](https://img.shields.io/npm/dm/@xstd/path.svg)
![NPM](https://img.shields.io/npm/l/@xstd/path.svg)
![npm type definitions](https://img.shields.io/npm/types/@xstd/path.svg)

## @xstd/path

This library provides a `Path` class to manage paths, somehow like the [URL class](https://developer.mozilla.org/en-US/docs/Web/API/URL).
It is used to normalize, mutate, contact, etc... different paths,
and extract some useful information like the basename, dirname, stem and ext, etc...

It supports multiple configurations and environments (windows and posix style),
and gives fine details and controls while manipulating paths.


**Example:**

```ts
import fs from 'node:fs/promises';
import { Path } from '@xstd/path';

const ROOT = Path.process();
const TMP_DIR = ROOT.concat('tmp');
const DEMO_FILE = TMP_DIR.concat('demo.txt');

function rename(
  path: Path,
  newName: string,
): Promise<void> {
  return fs.rename(
    path.dirname().concat(newName).toString(),
  );
}

await rename(DEMO_FILE, 'demo.js');

```

---

#### A word about NodeJS

> *But [path](https://nodejs.org/api/path.html) already exists on NodeJS 🤨 !?*


Sure ! But NodeJS's `path` is **inconsistent**, especially on edge cases:

- what are the normalizations of `/a/../../j`, `c:/d:`, `/..` ?
- what's the `basename` of `/` or `c:/` ? Or, what's the `dirname` of `d:/` ?
- what about `join('/home', '/etc')` ?

As you may immediately see, these cases are invalid paths or operations.
However, _instead of throwing_, NodeJS returns a path that may be totally different of what we may expect causing inconsistency.
This leads to unsafe paths and unexpected results, usually causing critical issues.

This library exposes a `Path` class which solves all these problems:
if a path is invalid (ex: `normalize('c:/d:')`) or  if an operation is impossible (ex: `join('/home', '/etc')`), it will throw instead of silently returning an invalid path.
You may argue that throwing  is worse, but you may ask yourself: do you prefer a silent, uncatchable, and potentially critical error, or a thrown and catchable error that won't cause hidden problems ?

> As opposed to NodeJS's `path`, this library always offer **safe** and **consistent** results.


Finally, this library works too in the browser, without the requirement of any build tool.

---

## 📦 Installation

```shell
yarn add @xstd/path
# or
npm install @xstd/path --save
```

## Table of contents
<!-- toc -->
- [Documentation](#documentation)
- [Comparision with NodeJS's path](#comparision-with-nodejss-path)
  + [Windows vs. POSIX](#windows-vs-posix)
  + [path.basename(path[, ext])](#pathbasenamepath-ext)
  + [path.delimiter](#pathdelimiter)
  + [path.dirname(path)](#pathdirnamepath)
  + [path.extname(path)](#pathextnamepath)
  + [path.isAbsolute(path)](#pathisabsolutepath)
  + [path.join([...paths])](#pathjoinpaths)
  + [path.normalize(path)](#pathnormalizepath)
  + [path.posix](#pathposix)
  + [path.relative(from, to)](#pathrelativefrom-to)
  + [path.resolve([...paths])](#pathresolvepaths)
  + [path.sep](#pathsep)
  + [path.win32](#pathwin32)


## Documentation

```ts
/** TYPES **/

type PathInput =
  | string // the path as a string
  | UncheckedPathSegments // the path as string segments (kind of .split('/'))
  | Path // a Path
;

class Path {
  static get posix(): PathPlatformConfig;
  static get windows(): WindowsPathPlatformConfig;
  static get generic(): PathPlatformConfig;
  static get currentPlatform(): IPathPlatformConfig | never;
  
  /**
   * Returns the current process working directory as a `Path`.
   */
  static process(config?: PathPlatformConfig): Path | never;
  
  /**
   * If `path` is a `Path`, returns `path`,
   * else creates a `Path` from `path`.
   *  => useful if you want to accept many types as the `path` input of a function without sacrificing performances
   */
  static of(path: PathInput, config?: PathPlatformConfig): Path;
  
  readonly segments: PathSegments;
  readonly config: PathPlatformConfig;
  
  constructor(path: PathInput, config?: PathPlatformConfig);
  
  /**
   * Returns `true` if this Path is absolute.
   */
  isAbsolute(): boolean;
  
  /**
   * Returns `true` if this Path is a pure root (ex: `c:` or `/`).
   */
  isRoot(): boolean;
  
  /**
   * Returns true if this Path is a sub-path of `path` (after normalization).
   *
   * @example:
   *  `new Path('a/b/').isSubPathOf('a/')` => `true`
   */
  isSubPathOf(parentPath: PathInput): boolean;
  
  /**
   * Returns `true` if this Path is equal to `path` (after normalization).
   *
   * @example:
   *  `new Path('a/b/').equals('a/c/../b')` => `true`
   */
  equals(path: PathInput): boolean;
  
  /**
   * Returns the parent directory's Path of this Path.
   * If this operation cannot be performed (ex: this Path is a "root"), the function throws.
   *
   * @example:
   *  `new Path('a/b').dirname()` => `./a`
   *  `new Path('c:/').dirname()` => throws
   */
  dirname(): Path | never;
  
  /**
   * Like `.dirname()`, but returns `null` instead of throwing.
   *
   * @see dirname
   */
  dirnameOptional(): Path | null;
  
  /**
   * Returns the basename of this Path:
   *  - if `ext` is provided, `ext` is removed from the basename
   *  - the function throws if the basename is special (ex: relative or root) and `allowedSpecialSegments` doesn't include it
   *
   * @param ext - default: `''`
   * @param allowedSpecialSegments - default: `new Set()`
   *
   * @example:
   *  `new Path('/a/b').basename()` => 'b'
   *  `new Path('/').basename()` => throws
   */
  basename(ext?: string, allowedSpecialSegments?: Iterable<SpecialSegmentsAllowedForBasename>): string | never;
  
  /**
   * Like `.basename(...)`, but returns `null` instead of throwing.
   *
   * @see basename
   */
  basenameOptional(ext?: string, allowedSpecialSegments?: Iterable<SpecialSegmentsAllowedForBasename>): string | null;
  
  /**
   * Returns a tuple composed of the stem and the extension of the basename of this Path.
   * If this operation cannot be performed (ex: this Path is a "root"), the function throws.
   */
  stemAndExt(): StemAndExtTuple | never;
  
  /**
   * Like `.stemAndExt(...)`, but returns `null` instead of throwing.
   *
   * @see stemAndExt
   */
  stemAndExtOptional(): StemAndExtTuple | null;
  
  /**
   * Returns the common base between this Path, and each `paths`:
   *  - if no common base are found, the function throws.
   *
   * @example:
   *  `new Path('a/b/').commonBase('a/c')` => `./a`
   *  `new Path('/a/b/').commonBase('d/e')` => throws
   */
  commonBase(...paths: PathInput[]): Path | never;
  
  /**
   * Like `.commonBase(...)`, but returns `null` instead of throwing.
   * @see commonBase
   */
  commonBaseOptional(...paths: PathInput[]): Path | null;
  
  /**
   * Returns the relative Path from this Path to `path` (after normalization)
   *  - the function throw if it's not possible to reach `path` from this Path.
   *
   * @example:
   *  `new Path('a/b/').relative('a/d')` => `../d`
   *  `new Path('a/b/').relative('/a/d')` => throws
   */
  relative(path: PathInput): Path | never;
  
  /**
   * Like `.relative(...)`, but returns `null` instead of throwing.
   * @see relative
   */
  relativeOptional(path: PathInput): Path | null;
  
  /**
   * Returns a new Path composed of this Path followed by 'paths'
   *  - equivalent of path.join() of NodeJS
   *
   * @example:
   *  - `new Path('./a').concat('b')` => `./a/b`
   */
  concat(...paths: PathInput[]): Path;
  
  /**
   * Returns a new absolute Path from this Path:
   * - if this Path is absolute, this function returns a cloned path,
   * - else it appends `root` before this Path
   *
   * @param root - default: `process.cwd()`
   */
  resolve(root?: PathInput): Path;
  
  /**
   * Clones the path. Kind of new Path(this, config) but faster.
   */
  clone(config?: PathPlatformConfig): Path;
  
  /**
   * Forces this Path to be converted to an absolute Path IF it is not already absolute.
   *
   * @param root - default: `process.cwd()`
   */
  makeAbsolute(root?: PathInput): Path;
  
  /**
   * Forces this Path to be converted to a relative path IF it is not already relative.
   *  => it replaces Path's first segment (the root) with '.'
   */
  makeRelative(): Path;
  
  /**
   * Returns the concatenated string of the different segments of this Path, separated by `separator`.
   * @param separator - default: `config.separator`
   */
  toString(separator?: string): string;
  
  /**
   * Returns a 'file://' url having this Path as pathname
   */
  toURL(): URL;
```


## Comparision with NodeJS's path

[NodeJS's path doc](https://nodejs.org/api/path.html)

#### Windows vs. POSIX

*Path* supports both *windows* and *posix* by default.

By using a specific config you can custom the behaviour: ex - to support only windows style paths -
```ts
new Path('C:\\temp\\myfile.html', Path.windows);
```

The config is transmitted to the descendants (ex: using `concat`).


#### path.basename(path[, ext])

```ts
new Path(path).basename(ext?);
```

#### path.delimiter

```ts
Path.currentPlatform.delimiterPattern;
```

#### path.dirname(path)

```ts
new Path(path).dirname();
```

#### path.extname(path)

```ts
new Path(path).stemAndExt().ext;
```

#### path.isAbsolute(path)

```ts
new Path(path).isAbsolute();
```

#### path.join([...paths])

```ts
new Path(path).concat(...paths);
```

#### path.normalize(path)

```ts
new Path(path); // because the input is always normalized in the constructor
```

#### path.posix

```ts
new Path(path, Path.posix);
```

#### path.relative(from, to)

```ts
new Path(from).relative(to);
```


#### path.resolve([...paths])

**WARN:** `new Path(path1).resolve(path2);` is not equivalent to `path.resolve([...paths])`.
NodeJS has a strange behaviour: it processes the arguments from right to left.
This library processes them from left to right.

`new Path(path1).resolve(path2);` may be translated to:
- if `path1` is absolute, returns this path
- else concacts (*path.join* in NodeJS) `path2` and `path1`

If `path2` is omitted, like NodeJS, `process.cwd` is used instead.

This is the correct equivalent:

```ts
// in NodeJS
path.resolve('/foo', '/bar', 'baz') // => would return /bar/baz

// with Path
new Path('baz') // './baz'
  .resolve('/bar') // '/bar/baz'
  .resolve('/foo'); // '/bar/baz' => there is no modification because the path is already absolute
```

#### path.sep

```ts
Path.currentPlatform.separator;
```

#### path.win32

```ts
new Path(path, Path.windows);
```

