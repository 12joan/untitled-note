import { getLocalStorage, setLocalStorage } from '~/lib/localStorage';

const setLastView = (projectId, view) =>
  setLocalStorage(`lastView:${projectId}`, view);
const getLastView = (projectId) => getLocalStorage(`lastView:${projectId}`);

export { setLastView, getLastView };
