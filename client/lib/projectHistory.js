import makeLocalHistory from '~/lib/localHistory';

const {
  touchItem: projectWasOpened,
  removeItem: removeProjectFromHistory,
  getItems: getProjectHistory,
} = makeLocalHistory({
  key: 'projectHistory',
});

const getLastOpenedProject = () => getProjectHistory()[0];

export { projectWasOpened, removeProjectFromHistory, getLastOpenedProject };
