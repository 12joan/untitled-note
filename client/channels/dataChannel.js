import consumer from './consumer'
import { handleSubscriptionStatusChanged } from './connectionStatus'

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
    connected() {
      handleSubscriptionStatusChanged(true)
    },

    disconnected() {
      handleSubscriptionStatusChanged(false)
    },

    received(data) {
      callback(JSON.parse(data))
    },
  },
)

export { streamAction }
