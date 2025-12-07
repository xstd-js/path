export namespace testTools {
  export function sleep(t: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, t));
  }

  export function polyfillRequestIdleCallback(): void {
    globalThis.requestIdleCallback ??= (
      callback: IdleRequestCallback,
      { timeout = 0 }: IdleRequestOptions = {},
    ): number => {
      return setTimeout(callback, timeout);
    };

    globalThis.cancelIdleCallback ??= (handle: number): void => {
      clearTimeout(handle);
    };
  }

  export function gc(): void {
    if (typeof (globalThis as any).gc === 'function') {
      return (globalThis as any).gc!();
    } else {
      throw new Error('Missing `gc` function. Did you `--expose-gc` ?');
    }
  }
}
