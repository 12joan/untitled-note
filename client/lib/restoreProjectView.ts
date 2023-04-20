import { getLocalStorage, setLocalStorage } from '~/lib/localStorage';

export const setLastView = (projectId: number, view: string) => {
  setLocalStorage(`lastView:${projectId}`, view);
};

export const getLastView = (projectId: number) => getLocalStorage<string>(`lastView:${projectId}`);
