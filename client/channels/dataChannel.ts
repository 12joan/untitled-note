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
        // Allow multiple identical subscriptions
        __subscription_id: Math.random(),
      },
    },
    {
      connected: () => handleSubscriptionStatusChanged(true),
      disconnected: () => handleSubscriptionStatusChanged(false),
      received: (data: string) => callback(JSON.parse(data)),
    }
  );
};
