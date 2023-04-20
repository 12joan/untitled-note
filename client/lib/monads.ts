export type PendingFuture<T> = {
  type: 'pending';
};

export type ResolvedFuture<T> = {
  type: 'resolved';
  data: T;
};

export type Future<T> = PendingFuture<T> | ResolvedFuture<T>;

export const pendingFuture = <T>(): Future<T> => ({
  type: 'pending',
});

export const resolvedFuture = <T>(data: T): Future<T> => ({
  type: 'resolved',
  data,
});

export const futureIsPending = ({ type }: Future<any>): boolean => type === 'pending';
export const futureIsResolved = ({ type }: Future<any>): boolean => type === 'resolved';

export const unwrapFuture = <T, R>(
  future: Future<T>,
  handlers: {
    pending: R;
    resolved: (data: T) => R;
  }
): R => {
  switch (future.type) {
    case 'pending':
      return handlers.pending;

    case 'resolved':
      return handlers.resolved(future.data);

    default:
      throw new Error('Unexpected future type');
  }
};

export const orDefaultFuture = <T>(
  future: Future<T>,
  defaultValue: T
): T => unwrapFuture(future, {
  pending: defaultValue,
  resolved: (data) => data,
});

export const mapFuture = <T, R>(
  future: Future<T>,
  f: (data: T) => R
): Future<R> => unwrapFuture(future, {
  pending: pendingFuture(),
  resolved: (data) => resolvedFuture(f(data)),
});

export const bindFuture = <T, R>(
  future: Future<T>,
  f: (data: T) => Future<R>
): Future<R> => unwrapFuture(future, {
  pending: pendingFuture(),
  resolved: (data) => f(data),
});

export const sequenceFutures = <T extends { [key: string]: any }>(
  futures: { [K in keyof T]: Future<T[K]> }
): Future<T> => (
  Object.entries(futures).reduce(
    (futureRecord, [key, future]) => (
      bindFuture(futureRecord, (record) => (
        mapFuture(future, (data) => ({
          ...record,
          [key]: data,
        }))
      ))
    ),
    resolvedFuture({} as T)
  )
);

export type SuccessServiceResult<T> = {
  type: 'success';
  data: T;
};

export type FailureServiceResult<E> = {
  type: 'failure';
  error: E;
};

export type ServiceResult<T, E> = SuccessServiceResult<T> | FailureServiceResult<E>;

export const successServiceResult = <T>(data: T): ServiceResult<T, never> => ({
  type: 'success',
  data,
});

export const failureServiceResult = <E>(error: E): ServiceResult<never, E> => ({
  type: 'failure',
  error,
});

export const serviceResultIsSuccess = ({ type }: ServiceResult<any, any>): boolean => type === 'success';
export const serviceResultIsFailure = ({ type }: ServiceResult<any, any>): boolean => type === 'failure';

export const unwrapServiceResult = <T, E, R>(
  serviceResult: ServiceResult<T, E>,
  handlers: {
    success: (data: T) => R;
    failure: (error: E) => R;
  }
): R => {
  switch (serviceResult.type) {
    case 'success':
      return handlers.success(serviceResult.data);

    case 'failure':
      return handlers.failure(serviceResult.error);

    default:
      throw new Error('Unexpected service result type');
  }
};

export const orDefaultServiceResult = <T, E>(
  serviceResult: ServiceResult<T, E>,
  defaultValue: T
): T => unwrapServiceResult(serviceResult, {
  success: (data) => data,
  failure: () => defaultValue,
});

export const mapServiceResult = <T, E, R>(
  serviceResult: ServiceResult<T, E>,
  f: (data: T) => R
): ServiceResult<R, E> => unwrapServiceResult(serviceResult, {
  success: (data) => successServiceResult(f(data)) as ServiceResult<R, E>,
  failure: (error) => failureServiceResult(error) as ServiceResult<R, E>,
});

export const bindServiceResult = <T, E, R>(
  serviceResult: ServiceResult<T, E>,
  f: (data: T) => ServiceResult<R, E>
): ServiceResult<R, E> => unwrapServiceResult(serviceResult, {
  success: (data) => f(data),
  failure: (error) => failureServiceResult(error),
});

export const promiseToServiceResult = <T, E>(
  promise: Promise<T>,
  callback: (serviceResult: ServiceResult<T, E>) => void
): void => {
  promise
    .then((data) => callback(successServiceResult(data)))
    .catch((error) => callback(failureServiceResult(error)));
};

export type FutureServiceResult<T, E> = Future<ServiceResult<T, E>>;

export const pendingFutureServiceResult = <T, E>(): FutureServiceResult<T, E> => pendingFuture();
export const successFutureServiceResult = <T, E>(data: T): FutureServiceResult<T, E> => resolvedFuture(successServiceResult(data));
export const failureFutureServiceResult = <T, E>(error: E): FutureServiceResult<T, E> => resolvedFuture(failureServiceResult(error));

export const futureServiceResultIsPending = futureIsPending;

export const futureServiceResultIsSuccess = (future: FutureServiceResult<any, any>): boolean => (
  unwrapFuture(future, {
    pending: false,
    resolved: serviceResultIsSuccess,
  })
);

export const unwrapFutureServiceResult = <T, E, R>(
  futureServiceResult: FutureServiceResult<T, E>,
  handlers: {
    pending: R;
    success: (data: T) => R;
    failure: (error: E) => R;
  }
): R => unwrapFuture(futureServiceResult, {
  pending: handlers.pending,
  resolved: (serviceResult) => unwrapServiceResult(serviceResult, {
    success: (data) => handlers.success(data),
    failure: (error) => handlers.failure(error),
  }),
});

export const orDefaultFutureServiceResult = <T, E>(
  futureServiceResult: FutureServiceResult<T, E>,
  defaultValue: T
): T => unwrapFutureServiceResult(futureServiceResult, {
  pending: defaultValue,
  success: (data) => data,
  failure: () => defaultValue,
});

export const mapFutureServiceResult = <T, E, R>(
  futureServiceResult: FutureServiceResult<T, E>,
  f: (data: T) => R
): FutureServiceResult<R, E> => mapFuture(
  futureServiceResult,
  (serviceResult) => mapServiceResult(serviceResult, f)
);

export const bindFutureServiceResult = <T, E, R>(
  futureServiceResult: FutureServiceResult<T, E>,
  f: (data: T) => FutureServiceResult<R, E>
): FutureServiceResult<R, E> => bindFuture(
  futureServiceResult,
  (serviceResult) => unwrapServiceResult(serviceResult, {
    success: (data) => f(data),
    failure: (error) => resolvedFuture(failureServiceResult(error)),
  })
);

export const promiseToFutureServiceResult = <T, E>(
  promise: Promise<T>,
  callback: (fsr: FutureServiceResult<T, E>) => void
): void => {
  promise
    .then((data) => callback(successFutureServiceResult(data)))
    .catch((error) => callback(failureFutureServiceResult(error)));
};
