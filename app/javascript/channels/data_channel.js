import consumer from './consumer'

const streamAction = (model, action, params) => consumer.subscriptions.create(
  {
    channel: 'DataChannel',
    model,
    action,
    params,
  },

  {
    connected() {
      // Called when the subscription is ready for use on the server
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      // Called when there's incoming data on the websocket for this channel
      console.log('Received:', data)
    },
  },
)

export { streamAction }
