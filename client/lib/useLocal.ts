import { retry } from '~/lib/retry';
import { useIsMounted } from '~/lib/useIsMounted';
import { useOverrideable } from '~/lib/useOverrideable';

export interface UseLocalOptions<T> {
  update: (params: Partial<T>, initialRecord: T) => Promise<unknown>;
  handleUpdateError: (promise: Promise<unknown>) => Promise<unknown>;
}

export const useLocal = <T>(
  initialRecord: T,
  { update: updateRemote, handleUpdateError }: UseLocalOptions<T>
) => {
  const [localRecord, setLocalRecord] = useOverrideable(initialRecord);
  const isMounted = useIsMounted();

  const updateRecord = async (params: Partial<T>) => {
    setLocalRecord({
      ...localRecord,
      ...params,
    });

    await handleUpdateError(
      retry(() => updateRemote(params, initialRecord), {
        shouldRetry: isMounted,
      })
    ).catch((error) => {
      setLocalRecord(initialRecord);
      throw error;
    });
  };

  return [localRecord, updateRecord] as const;
};
