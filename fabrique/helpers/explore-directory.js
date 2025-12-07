import { opendir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import process from 'node:process';

/**
 * Runs "command" into the terminal.
 * @param {string} path
 * @param {{relativeTo?: string; pick?: (path: string, type: { isFile: boolean; isDirectory: boolean; }) => boolean; }?} options
 * @return {AsyncGenerator<string>}
 */
export async function* exploreDirectoryFiles(path, options) {
  const dir = await opendir(resolve(process.cwd(), path));

  for await (const dirent of dir) {
    const path = join(dirent.parentPath, dirent.name);
    const relativePath =
      options?.relativeTo === undefined ? path : relative(options.relativeTo, path);

    if (
      options?.pick?.(relativePath, {
        isFile: dirent.isFile(),
        isDirectory: dirent.isDirectory(),
      }) ??
      true
    ) {
      if (dirent.isFile()) {
        yield relativePath;
      } else if (dirent.isDirectory()) {
        yield* exploreDirectoryFiles(path, options);
      }
    }
  }
}
