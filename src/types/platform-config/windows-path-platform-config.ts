import type { PathPlatformConfig } from './path-platform-config.js';

export interface WindowsPathPlatformConfig extends PathPlatformConfig {
  readonly driveLetterPattern: string;
  readonly driveLetterRegEx: RegExp;
  readonly networkPattern: string;
  readonly networkRegEx: RegExp;
}
