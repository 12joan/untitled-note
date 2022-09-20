const Future = {
  makeFuture: (type, data = undefined) => ({
    type,
    data,

    isPending: type === 'pending',
    isResolved: type === 'resolved',
    unwrap: handlers => handlers[type](data),
    orDefault: defaultValue => type === 'resolved' ? data : defaultValue,

    bind: f => type === 'resolved' ? f(data) : Future.pending(),
    map: f => type === 'resolved' ? Future.resolved(f(data)) : Future.pending(),
  }),

  pending: () => Future.makeFuture('pending'),
  resolved: data => Future.makeFuture('resolved', data),
}

const ServiceResult = {
  makeServiceResult: (type, data = undefined) => ({
    type,
    data,

    isSuccess: type === 'success',
    isFailure: type === 'failure',
    unwrap: handlers => handlers[type](data),
    orDefault: defaultValue => type === 'success' ? data : defaultValue,

    bind: f => type === 'success' ? f(data) : ServiceResult.failure(),
    map: f => type === 'success' ? ServiceResult.success(f(data)) : ServiceResult.failure(),
  }),

  fromPromise: (promise, consumer) => promise.then(
    data => consumer(ServiceResult.success(data)),
    error => consumer(ServiceResult.failure(error))
  ),

  success: data => ServiceResult.makeServiceResult('success', data),
  failure: error => ServiceResult.makeServiceResult('failure', error),
}

const FutureServiceResult = {
  fromFuture: future => ({
    future,

    isPending: future.isPending,

    isSuccess: future.unwrap({
      pending: () => false,
      resolved: serviceResult => serviceResult.isSuccess,
    }),

    isFailure: future.unwrap({
      pending: () => false,
      resolved: serviceResult => serviceResult.isFailure,
    }),

    unwrap: handlers => future.unwrap({
      pending: handlers.pending,
      resolved: serviceResult => serviceResult.unwrap({
        success: handlers.success,
        failure: handlers.failure,
      }),
    }),

    bind: f => future.unwrap({
      pending: FutureServiceResult.pending,
      resolved: serviceResult => serviceResult.unwrap({
        success: f,
        failure: FutureServiceResult.failure,
      }),
    }),

    map: f => future.unwrap({
      pending: FutureServiceResult.pending,
      resolved: serviceResult => serviceResult.unwrap({
        success: data => FutureServiceResult.success(f(data)),
        failure: FutureServiceResult.failure,
      }),
    }),
  }),

  fromPromise: (promise, consumer) => promise.then(
    data => consumer(FutureServiceResult.success(data)),
    error => consumer(FutureServiceResult.failure(error))
  ),

  pending: () => FutureServiceResult.fromFuture(Future.pending()),
  success: data => FutureServiceResult.fromFuture(Future.resolved(ServiceResult.success(data))),
  failure: error => FutureServiceResult.fromFuture(Future.resolved(ServiceResult.failure(error))),
}


export default Future

export {
  Future,
  ServiceResult,
  FutureServiceResult,
}
