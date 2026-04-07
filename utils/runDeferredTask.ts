/**
 * Schedules work after the current frame without using deprecated InteractionManager.
 * Uses requestIdleCallback when available (modern RN/Hermes); otherwise setTimeout(0).
 */
export function runDeferredTask(callback: () => void): { cancel: () => void } {
  let cancelled = false;
  const run = () => {
    if (!cancelled) callback();
  };

  const g = globalThis as typeof globalThis & {
    requestIdleCallback?: (
      cb: () => void,
      opts?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (typeof g.requestIdleCallback === 'function') {
    const id = g.requestIdleCallback(run, { timeout: 1000 });
    return {
      cancel: () => {
        cancelled = true;
        g.cancelIdleCallback?.(id);
      },
    };
  }

  const timeoutId = setTimeout(run, 0);
  return {
    cancel: () => {
      cancelled = true;
      clearTimeout(timeoutId);
    },
  };
}
