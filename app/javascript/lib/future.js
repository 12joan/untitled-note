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

export default Future
