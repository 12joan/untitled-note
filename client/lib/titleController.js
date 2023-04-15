import { useEffect } from 'react';

class TitleController {
  providers = [];

  addProvider(provider) {
    this.providers.unshift(provider);
  }

  removeProvider(provider) {
    this.providers = this.providers.filter((x) => x !== provider);
  }

  updateTitle() {
    const parts = this.providers.map((p) => p());
    document.title = parts.join(' | ');
  }
}

const titleController = new TitleController();

const useTitle = (provider) => {
  useEffect(() => {
    titleController.addProvider(provider);
    return () => titleController.removeProvider(provider);
  });

  useEffect(() => {
    titleController.updateTitle();
  }, [provider()]);
};

export { useTitle };
