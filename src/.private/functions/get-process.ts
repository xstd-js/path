export function getProcess(): any /*NodeJS.Process*/ | never {
  if (typeof globalThis['process'] !== 'undefined') {
    return (globalThis as any).process;
  } else {
    throw new Error("Not on a NodeJS's environment");
  }
}
