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

> *But [path](https://nodejs.org/api/path.html) already exists on NodeJS 🤨 !?*

Sure ! But if you use them you'll probably encounter at least one of these limits:



Yes sure ! However, this library has many advantages:

- it works immediately in any environment (both browser and NodeJs, where `path` only works on `node` or using some polyfills)
- when you use a `Path` object, you're guaranteed to have a normalized and functional path,
  instead of a simple string which could contain an invalid path or anything else.
- this library covers some edge cases like: `dirname` or `basename` on a root path,
  or normalization of *strange* paths like: `/a/../../j`, `c:/d:`, `/..`, which are not well handled by NodeJs' `path`!
- this library throwns on invalid paths
  - with this library, like the `URL` class, if the path is invalid it will throw, instead of silently returning another invalid path
    => the NodeJS implementation has a lot of holes not covered.

**UNLIKE NODEJS' PATH, this library throws if a path is or becomes invalid.**
This prevents many unexpected behaviours on wrong paths.
For example `new Path('/home').concat('/etc/')` will throw because the resulting Path is invalid (you cannot concat a *root* to another one).
On NodeJS, `path.join('/home', '/etc')` gives `'/home/etc'` which is probably not what you're expecting.
And it gets worse when you mix windows and posix paths...

In conclusion, **this library is more resilient and offers better tools** than the classical NodeJS' one.




## 📦 Installation

```shell
yarn add @xstd/path
# or
npm install @xstd/path --save
```
