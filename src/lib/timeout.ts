const DEFAULT_TIMEOUT_MS = 12_000;

export function withTimeout<T>(
  promise: Promise<T>,
  ms: number = DEFAULT_TIMEOUT_MS,
  message = '요청 시간이 초과되었습니다.',
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

/**
 * Firestore's onSnapshot never settles (success or error) while the client
 * is offline/unreachable — it just waits for connectivity. This guards
 * against an indefinite loading state by firing onError once if neither
 * callback has run within `ms`.
 */
export function guardSnapshotTimeout(
  onError: ((error: Error) => void) | undefined,
  ms: number = DEFAULT_TIMEOUT_MS,
) {
  let settled = false;
  const timer = setTimeout(() => {
    if (settled) return;
    settled = true;
    onError?.(new Error('요청 시간이 초과되었습니다.'));
  }, ms);

  return {
    markSettled(): void {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
    },
    dispose(): void {
      clearTimeout(timer);
    },
  };
}
