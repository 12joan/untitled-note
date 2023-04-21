import { useRef, useState } from 'react';
import { dispatchGlobalEvent, useGlobalEvent } from '~/lib/globalEvents';

export const CONNECTION_STATUS_CONNECTING = 'connecting';
export const CONNECTION_STATUS_CONNECTED = 'connected';
export const CONNECTION_STATUS_DISCONNECTED = 'disconnected';

export type ConnectionStatus =
  | typeof CONNECTION_STATUS_CONNECTING
  | typeof CONNECTION_STATUS_CONNECTED
  | typeof CONNECTION_STATUS_DISCONNECTED;

let connectionStatus: ConnectionStatus = CONNECTION_STATUS_CONNECTING;

export const handleSubscriptionStatusChanged = (subscriptionConnected: boolean) => {
  const newStatus = subscriptionConnected
    ? CONNECTION_STATUS_CONNECTED
    : CONNECTION_STATUS_DISCONNECTED;

  if (newStatus !== connectionStatus) {
    connectionStatus = newStatus;
    dispatchGlobalEvent('connectionStatusChanged', newStatus);
  }
};

export const useConnectionStatus = () => {
  const [status, setStatus] = useState(connectionStatus);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useGlobalEvent('connectionStatusChanged', (newStatus) => {
    if (newStatus === CONNECTION_STATUS_CONNECTED) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setStatus(newStatus);
    } else {
      timeoutRef.current = setTimeout(() => {
        setStatus(newStatus);
        timeoutRef.current = null;
      }, 1000);
    }
  });

  return status;
};

export const useConnected = () => (
  useConnectionStatus() === CONNECTION_STATUS_CONNECTED
);

export const useDisconnected = () => (
  useConnectionStatus() === CONNECTION_STATUS_DISCONNECTED
);
