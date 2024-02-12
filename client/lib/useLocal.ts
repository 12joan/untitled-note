import {retry} from "./retry";
import {useIsMounted} from "./useIsMounted";
import {useOverrideable} from "./useOverrideable";

export interface UseLocalOptions<T extends { id: unknown }> {
  update: (id: T['id'], params: Partial<T>) => Promise<unknown>;
  handleUpdateError: (promise: Promise<unknown>) => Promise<unknown>;
}

export const useLocal = <T extends { id: unknown }>(
  initialRecord: T,
  {
    update: updateRemote,
    handleUpdateError,
  }: UseLocalOptions<T>
) => {
  const [localRecord, setLocalRecord] = useOverrideable(initialRecord);
  const isMounted = useIsMounted();

  const updateRecord = async (params: Partial<T>) => {
    setLocalRecord({
      ...localRecord,
      ...params,
    });

    await handleUpdateError(
      retry(() => updateRemote(initialRecord.id, params), {
        shouldRetry: isMounted,
      })
    ).catch((error) => {
      setLocalRecord(initialRecord);
      throw error;
    });
  };

  return [localRecord, updateRecord] as const;
};
