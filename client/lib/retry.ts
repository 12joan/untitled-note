export interface RetryOptions {
  maxRetries?: number;
  interval?: number;
  shouldRetry?: (error: any) => boolean;
  setIsFailing?: (isFailing: boolean) => void;
}

export const retry = <T>(
  func: () => Promise<T>,
  {
    maxRetries = 5,
    interval = 1000,
    shouldRetry = () => true,
    setIsFailing = () => {},
  }: RetryOptions = {}
): Promise<T> =>
  new Promise((resolve, reject) => {
    const attempt = (retriesLeft: number) =>
      func()
        .then((data) => {
          setIsFailing(false);
          resolve(data);
        })
        .catch((error) => {
          if (retriesLeft === 0 || !shouldRetry(error)) {
            setIsFailing(true);
            reject(error);
          } else {
            // eslint-disable-next-line no-console
            console.error(error);
            // eslint-disable-next-line no-console
            console.warn(`Retrying in ${interval}ms...`);
            setTimeout(() => attempt(retriesLeft - 1), interval);
            setIsFailing(true);
          }
        });

    attempt(maxRetries);
  });
