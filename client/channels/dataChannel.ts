import { Stream } from '~/lib/types';
import { handleSubscriptionStatusChanged } from './connectionStatus';
import consumer from './consumer';

export const streamAction = <T>(
  model: string,
  action: string,
  params: Record<string, any>,
  callback: (data: T) => void
): Stream => {
  return consumer.subscriptions.create(
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
        handleSubscriptionStatusChanged(true);
      },

      disconnected() {
        handleSubscriptionStatusChanged(false);
      },

      received(data) {
        callback(JSON.parse(data));
      },

      unsubscribe() {},
    }
  );
};
