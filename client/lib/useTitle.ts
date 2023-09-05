import { useEffect } from 'react';
import { APP_NAME } from '~/lib/config';

type TitleEntry = {
  title: string;
};

let titleStack: TitleEntry[] = [{ title: APP_NAME }];

const updateTitle = () => {
  document.title = titleStack[titleStack.length - 1].title;
};

export const useTitle = (title?: string) =>
  useEffect(() => {
    if (title) {
      const entry = { title };
      titleStack.push(entry);

      updateTitle();

      return () => {
        titleStack = titleStack.filter((e) => e !== entry);
        updateTitle();
      };
    }
  }, [title]);
