import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import process from 'node:process';
import { ROOT_PATH } from '../constants/root-path.constant.js';
import { cmd } from '../helpers/cmd.js';
import { exploreDirectoryFiles } from '../helpers/explore-directory.js';

/**
 * Builds the lib.
 * @param {{ mode?: 'dev' | 'rc' | 'prod' }} options
 * @return {Promise<void>}
 */
export async function build({ mode = 'prod' } = {}) {
  const sourcePath = join(ROOT_PATH, 'src');
  const destinationPath = join(ROOT_PATH, 'dist');

  await removeDestination(destinationPath);

  try {
    const [withProtected] = await Promise.all([
      buildTypescript(sourcePath),
      buildScss(sourcePath, destinationPath),
      copyOtherFiles(ROOT_PATH, destinationPath),
    ]);

    await buildPackageJsonFile(destinationPath, {
      mode,
      withProtected,
    });
  } catch (error) {
    await removeDestination(destinationPath);
    throw error;
  }

  console.log('Library built with success !');
}

/**
 * Removes the destination folder.
 *
 * @param {string} destinationPath
 * @return {Promise<void>}
 */
async function removeDestination(destinationPath) {
  await rm(destinationPath, { recursive: true, force: true });
}

/**
 * Returns true if `path` is a `protected` directory.
 *
 * @param {string} path
 * @return boolean
 */
function isProtectedDirectory(path) {
  return path.endsWith('.protected');
}

/**
 * Returns true if `path` is inside a `protected` directory.
 *
 * @param {string} path
 * @return boolean
 */
function isInProtectedDirectory(path) {
  return path.includes('.protected/');
}

/**
 * Returns true if `path` is a `private` directory.
 *
 * @param {string} path
 * @return boolean
 */

function isPrivateDirectory(path) {
  return path.endsWith('.private');
}

/**
 * Returns true if `path` is inside a `private` directory.
 *
 * @param {string} path
 * @return boolean
 */
function isInPrivateDirectory(path) {
  return path.includes('.private/');
}

/* TYPESCRIPT */

/**
 * Builds the typescript part.
 *
 * @param {string} sourcePath
 * @return {Promise<boolean>}
 */
async function buildTypescript(sourcePath) {
  const typescriptIndexFilePath = await buildTypescriptIndexFile(sourcePath);
  const typescriptProtectedIndexFilePath = await buildTypescriptProtectedIndexFile(sourcePath);

  try {
    await compileTypescript();
    // await copyTypescriptFiles(sourcePath, destinationPath);
  } finally {
    await removeTypescriptIndexFile(typescriptIndexFilePath);
    if (typescriptProtectedIndexFilePath !== null) {
      await removeTypescriptIndexFile(typescriptProtectedIndexFilePath);
    }
  }

  return typescriptProtectedIndexFilePath !== null;
}

function generateExportEsmLine(path) {
  return `export * from './${path.replaceAll('\\', '/').slice(0, -3)}.js';\n`;
}

/**
 * Returns true if `path` is a `typescript` file.
 *
 * @param {string} path
 * @return boolean
 */
function isTsFile(path) {
  return path.endsWith('.ts');
}

/**
 * Returns true if `path` is a typescript `test or spec` file.
 *
 * @param {string} path
 * @return boolean
 */
function isTsTestOrSpecFile(path) {
  return path.endsWith('.test.ts') || path.endsWith('.spec.ts');
}

/**
 * Returns true if `path` is a typescript `bench` file.
 *
 * @param {string} path
 * @return boolean
 */
function isTsBenchFile(path) {
  return path.endsWith('.bench.ts');
}

/**
 * Returns true if `path` is a typescript `protected` file.
 *
 * @param {string} path
 * @return boolean
 */
function isTsProtectedFile(path) {
  return path.endsWith('.protected.ts');
}

/**
 * Returns true if `path` is a typescript `private` file.
 *
 * @param {string} path
 * @return boolean
 */
function isTsPrivateFile(path) {
  return path.endsWith('.private.ts');
}

/**
 * Builds the typescript index file used to export all public APIs.
 *
 * @param {string} sourcePath
 * @return {Promise<string>}
 */
async function buildTypescriptIndexFile(sourcePath) {
  console.log('Building typescript index file...');

  let content = '';

  for await (const path of exploreDirectoryFiles(sourcePath, {
    relativeTo: sourcePath,
    pick: (path, { isFile }) => {
      if (isFile) {
        return (
          isTsFile(path) &&
          !(
            isTsTestOrSpecFile(path) ||
            isTsBenchFile(path) ||
            isTsProtectedFile(path) ||
            isTsPrivateFile(path)
          )
        );
      } else {
        return !(isProtectedDirectory(path) || isPrivateDirectory(path));
      }
    },
  })) {
    content += generateExportEsmLine(path);
  }

  if (content === '') {
    throw new Error('Nothing exported.');
  }

  const indexFilePath = join(sourcePath, 'index.ts');
  await writeFile(indexFilePath, content + '\n');

  return indexFilePath;
}

/**
 * Builds the typescript index file used to export all protected APIs.
 *
 * @param {string} sourcePath
 * @return {Promise<string | null>}
 */
async function buildTypescriptProtectedIndexFile(sourcePath) {
  console.log('Building typescript protected index file...');

  let content = '';

  for await (const path of exploreDirectoryFiles(sourcePath, {
    relativeTo: sourcePath,
    pick: (path, { isFile }) => {
      if (isFile) {
        return (
          isTsProtectedFile(path) ||
          (isInProtectedDirectory(path) &&
            isTsFile(path) &&
            !(isTsTestOrSpecFile(path) || isTsBenchFile(path) || isTsPrivateFile(path)))
        );
      } else {
        return !isPrivateDirectory(path);
      }
    },
  })) {
    content += generateExportEsmLine(path);
  }

  if (content === '') {
    return null;
  }

  const indexFilePath = join(sourcePath, 'index.protected.ts');
  await writeFile(indexFilePath, content + '\n');

  return indexFilePath;
}

/**
 * Compiles the typescript files.
 *
 * @param {string | undefined } rootPath
 * @return {Promise<void>}
 */
async function compileTypescript(rootPath = process.cwd()) {
  console.log('Compiling typescript...');

  await cmd('tsc', ['-p', './tsconfig.build.json'], { cwd: rootPath });
}

/**
 * Copies typescript files into the destination.
 *
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @return {Promise<void>}
 */
async function copyTypescriptFiles(sourcePath, destinationPath) {
  console.log('Copying typescript files...');

  throw 'TODO';
  // for await (const path of exploreDirectoryFiles(sourcePath, {
  //   relativeTo: sourcePath,
  //   pick: (path, { isFile }) => {
  //     if (isFile) {
  //       return (
  //         path.endsWith('.ts') &&
  //         !path.endsWith('.spec.ts') &&
  //         !path.endsWith('.test.ts') &&
  //         !path.endsWith('.bench.ts')
  //       );
  //     } else {
  //       return true;
  //     }
  //   },
  // })) {
  //   await cp(join(sourcePath, path), join(destinationPath, path));
  // }
}

/**
 * Removes the index file.
 *
 * @param {string} indexFilePath
 * @return {Promise<void>}
 */
async function removeTypescriptIndexFile(indexFilePath) {
  await rm(indexFilePath);
}

/* SCSS*/

/**
 * Builds the scss part.
 *
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @return {Promise<void>}
 */
async function buildScss(sourcePath, destinationPath) {
  await copyScssFiles(sourcePath, destinationPath);
  await buildScssIndexFile(destinationPath);
}

function generateExportScssLine(path) {
  return `@forward './${path.slice(0, -5)}';\n`;
}

/**
 * Returns true if `path` is a `scss` file.
 *
 * @param {string} path
 * @return boolean
 */
function isScssFile(path) {
  return path.endsWith('.scss');
}

/**
 * Returns true if `path` is a scss `protected` file.
 *
 * @param {string} path
 * @return boolean
 */
function isScssProtectedFile(path) {
  return path.endsWith('.protected.scss');
}

/**
 * Returns true if `path` is a scss `private` file.
 *
 * @param {string} path
 * @return boolean
 */
function isScssPrivateFile(path) {
  return path.endsWith('.private.scss');
}

/**
 * Builds the scss index file used to export all public styles.
 *
 * @param {string} sourcePath
 * @return {Promise<void>}
 */
async function buildScssIndexFile(sourcePath) {
  console.log('Building scss index file...');

  let content = '';

  for await (const path of exploreDirectoryFiles(sourcePath, {
    relativeTo: sourcePath,
    pick: (path, { isFile }) => {
      if (isFile) {
        return isScssFile(path) && !(isScssProtectedFile(path) && isScssPrivateFile(path));
      } else {
        return !(isProtectedDirectory(path) || isPrivateDirectory(path));
      }
    },
  })) {
    content += generateExportScssLine(path);
  }

  if (content === '') {
    console.log('=> No scss file to export.');
  } else {
    const indexFilePath = join(sourcePath, 'index.scss');
    await writeFile(indexFilePath, content + '\n');
  }
}

/**
 * Copies scss files into the destination.
 *
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @return {Promise<void>}
 */
async function copyScssFiles(sourcePath, destinationPath) {
  console.log('Copying scss files...');

  for await (const path of exploreDirectoryFiles(sourcePath, {
    relativeTo: sourcePath,
    pick: (path, { isFile }) => {
      if (isFile) {
        return isScssFile(path);
      } else {
        return true;
      }
    },
  })) {
    // await cp(join(sourcePath, path), join(destinationPath, path));
    await writeFile(
      join(destinationPath, path),
      fixScssFileContent(await readFile(join(sourcePath, path), { encoding: 'utf8' })),
    );
  }
}

/**
 * Fixes the content of a scss file.
 *
 * @param {string} content
 * @return {string}
 */
function fixScssFileContent(content) {
  return content.replace(/@(use|import)\s+['"]([^'"]*)['"]/g, (_, type, importPath) => {
    if (isAbsolute(importPath)) {
      throw new Error(`Import path ${importPath} cannot be absolute.`);
    }

    if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
      importPath = `./${importPath}`;
    }

    if (importPath.endsWith('.scss')) {
      importPath = importPath.slice(0, -5);
    }

    return `@${type} '${fixScssFilePath(importPath)}'`;
  });
}

/**
 * Fixes a scss file path.
 *
 * @param {string} path
 * @return {string}
 */
function fixScssFilePath(path) {
  if (!path.startsWith('@')) {
    if (isAbsolute(path)) {
      throw new Error(`Import path ${path} cannot be absolute.`);
    }

    if (!path.startsWith('./') && !path.startsWith('../')) {
      path = `./${path}`;
    }
  }

  if (path.endsWith('.scss')) {
    path = path.slice(0, -5);
  }

  return path;
}

/* OTHER */

/**
 * Copies other files.
 *
 * @param {string} rootPath
 * @param {string} destinationPath
 * @return {Promise<void>}
 */
async function copyOtherFiles(rootPath, destinationPath) {
  console.log('Copying other files...');

  await Promise.all(
    ['README.md', 'CONTRIBUTING.md', 'LICENSE'].map((path) => {
      return cp(join(rootPath, path), join(destinationPath, path)).catch(() => {
        console.log(`Missing file: ${path}`);
      });
    }),
  );
}

/**
 * Generates the package.json to publish.
 *
 * @param {string} destinationPath
 * @param {{ rootPath?: string; mode?: 'dev' | 'rc' | 'prod', withProtected?: boolean }} options
 * @return {Promise<void>}
 */
async function buildPackageJsonFile(
  destinationPath,
  { rootPath = process.cwd(), mode = 'prod', withProtected = false } = {},
) {
  console.log('Building package.json...');

  const fileName = 'package.json';

  /**
   * @type any
   */
  const pkg = JSON.parse(await readFile(join(rootPath, fileName), { encoding: 'utf8' }));

  const indexTypesPath = './index.d.ts';

  if (mode !== 'prod') {
    pkg.version += `-${mode}.${Date.now()}`;
  }

  Object.assign(pkg, {
    exports: {
      '.': {
        types: indexTypesPath,
        default: './index.js',
      },
      ...(withProtected
        ? {
            './protected': {
              types: './index.protected.d.ts',
              default: './index.protected.js',
            },
          }
        : {}),
    },
    typings: indexTypesPath,
    types: indexTypesPath,
  });

  await writeFile(join(destinationPath, fileName), JSON.stringify(pkg, null, 2));
}
