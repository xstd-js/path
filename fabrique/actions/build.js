import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import process from 'node:process';
import { cmd } from '../helpers/cmd.js';
import { exploreDirectoryFiles } from '../helpers/explore-directory.js';

/**
 * Builds the lib.
 * @param {{ mode?: 'dev' | 'rc' | 'prod' }} options
 * @return {Promise<void>}
 */
export async function build({ mode = 'prod' } = {}) {
  const rootPath = '.';
  const sourcePath = './src';
  const destinationPath = './dist';

  await removeDestination(destinationPath);

  try {
    const [withProtected] = await Promise.all([
      buildTypescript(sourcePath),
      buildScss(sourcePath, destinationPath),
      copyOtherFiles(rootPath, destinationPath),
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

function generateExportEsmLine(path) {
  return `export * from './${path.replaceAll('\\', '/').slice(0, -3)}.js';\n`;
}

/**
 * Builds the typescript index file used to export all public APIs.
 *
 * @param {string} cwd
 * @return {Promise<string>}
 */
async function buildTypescriptIndexFile(cwd = process.cwd()) {
  console.log('Building typescript index file...');

  let content = '';

  for await (const path of exploreDirectoryFiles(cwd, {
    relativeTo: cwd,
    pick: (path, { isFile }) => {
      if (isFile) {
        return (
          path.endsWith('.ts') &&
          !path.endsWith('.spec.ts') &&
          !path.endsWith('.test.ts') &&
          !path.endsWith('.private.ts') &&
          !path.endsWith('.protected.ts')
        );
      } else {
        return !path.endsWith('.private') && !path.endsWith('.protected');
      }
    },
  })) {
    content += generateExportEsmLine(path);
  }

  if (content === '') {
    throw new Error('Nothing exported.');
  }

  const indexFilePath = join(cwd, 'index.ts');
  await writeFile(indexFilePath, content + '\n');

  return indexFilePath;
}

/**
 * Builds the typescript index file used to export all protected APIs.
 *
 * @param {string} cwd
 * @return {Promise<string | null>}
 */
async function buildTypescriptProtectedIndexFile(cwd = process.cwd()) {
  console.log('Building typescript protected index file...');

  let content = '';

  for await (const path of exploreDirectoryFiles(cwd, {
    relativeTo: cwd,
    pick: (path, { isFile }) => {
      if (isFile) {
        return (
          path.endsWith('.protected.ts') || (path.endsWith('.ts') && path.includes('.protected/'))
        );
      } else {
        return !path.endsWith('.private');
      }
    },
  })) {
    content += generateExportEsmLine(path);
  }

  if (content === '') {
    return null;
  }

  const indexFilePath = join(cwd, 'index.protected.ts');
  await writeFile(indexFilePath, content + '\n');

  return indexFilePath;
}

/**
 * Compiles the typescript files.
 *
 * @param {string | undefined } cwd
 * @return {Promise<void>}
 */
async function compileTypescript(cwd = process.cwd()) {
  console.log('Compiling typescript...');

  await cmd('tsc', ['-p', './tsconfig.build.json'], { cwd });
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

  for await (const path of exploreDirectoryFiles(sourcePath, {
    relativeTo: sourcePath,
    pick: (path, { isFile }) => {
      if (isFile) {
        return path.endsWith('.ts') && !path.endsWith('.spec.ts') && !path.endsWith('.test.ts');
      } else {
        return true;
      }
    },
  })) {
    await cp(join(sourcePath, path), join(destinationPath, path));
  }
}

function generateExportScssLine(path) {
  return `@forward './${path.slice(0, -5)}';\n`;
}

/**
 * Builds the scss index file used to export all public styles.
 *
 * @param {string} cwd
 * @return {Promise<void>}
 */
async function buildScssIndexFile(cwd = process.cwd()) {
  console.log('Building scss index file...');

  let content = '';

  for await (const path of exploreDirectoryFiles(cwd, {
    relativeTo: cwd,
    pick: (path, { isFile }) => {
      if (isFile) {
        return (
          path.endsWith('.scss') &&
          !path.endsWith('.protected.scss') &&
          !path.endsWith('.private.scss')
        );
      } else {
        return !path.endsWith('.private') && !path.endsWith('.protected');
      }
    },
  })) {
    content += generateExportScssLine(path);
  }

  if (content === '') {
    console.log('=> No scss file to export.');
  } else {
    const indexFilePath = join(cwd, 'index.scss');
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
        return path.endsWith('.scss');
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
 * Removes the index file.
 *
 * @param {string} indexFilePath
 * @return {Promise<void>}
 */
async function removeTypescriptIndexFile(indexFilePath) {
  await rm(indexFilePath);
}

/**
 * Generates the package.json to publish.
 *
 * @param {string} destinationPath
 * @param {{ cwd?: string; mode?: 'dev' | 'rc' | 'prod', withProtected?: boolean }} options
 * @return {Promise<void>}
 */
async function buildPackageJsonFile(
  destinationPath,
  { cwd = process.cwd(), mode = 'prod', withProtected = false } = {},
) {
  console.log('Building package.json...');

  const fileName = 'package.json';

  /**
   * @type any
   */
  const pkg = JSON.parse(await readFile(join(cwd, fileName), { encoding: 'utf8' }));

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
