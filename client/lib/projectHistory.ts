import { makeLocalHistory } from '~/lib/localHistory';

const {
  touchItem: projectWasOpened,
  removeItem: removeProjectFromHistory,
  getItems: getProjectHistory,
} = makeLocalHistory<number>({
  key: 'projectHistory',
});

export { projectWasOpened, removeProjectFromHistory };

export const getLastOpenedProject = () => getProjectHistory()[0];
