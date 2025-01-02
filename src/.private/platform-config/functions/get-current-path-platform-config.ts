import type { PathPlatformConfig } from '../../../types/platform-config/path-platform-config.js';
import { getProcess } from '../../functions/get-process.js';
import { POSIX_PATH_PLATFORM_CONFIG } from '../constants/posix-path-platform-config.constants.js';
import { WINDOWS_PATH_PLATFORM_CONFIG } from '../constants/windows-path-platform-config.constants.js';

export function getCurrentPathPlatformConfig(): PathPlatformConfig | never {
  return getProcess().platform === 'win32'
    ? WINDOWS_PATH_PLATFORM_CONFIG
    : POSIX_PATH_PLATFORM_CONFIG;
}
