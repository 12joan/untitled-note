export interface RetryOptions {
  maxRetries?: number;
  interval?: number;
  shouldRetry?: (error: any) => boolean;
}

export const retry = <T>(
  func: () => Promise<T>,
  {
    maxRetries = 5,
    interval = 1000,
    shouldRetry = () => true,
  }: RetryOptions = {}
): Promise<T> =>
  new Promise((resolve, reject) => {
    const attempt = (retriesLeft: number) =>
      func()
        .then(resolve)
        .catch((error) => {
          if (retriesLeft === 0 || !shouldRetry(error)) {
            reject(error);
          } else {
            // eslint-disable-next-line no-console
            console.warn(error);
            // eslint-disable-next-line no-console
            console.warn(`Retrying in ${interval}ms...`);
            setTimeout(() => attempt(retriesLeft - 1), interval);
          }
        });

    attempt(maxRetries);
  });
