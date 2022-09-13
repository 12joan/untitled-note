import consumer from './consumer'

const streamAction = (model, action, params, callback) => consumer.subscriptions.create(
  {
    channel: 'DataChannel',
    model,
    action,
    params: {
      ...params,
      __subscription_id: Math.random(), // Allow multiple identical subscriptions
    },
  },

  {
    connected() {},
    disconnected() {},

    received(data) {
      callback(JSON.parse(data))
    },
  },
)

export { streamAction }
