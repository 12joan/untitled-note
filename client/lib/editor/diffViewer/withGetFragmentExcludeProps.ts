import { isElement, PlateEditor, TDescendant } from '~/lib/editor/plate';

export const withGetFragmentExcludeProps =
  (...propNames: string[]) =>
  (editor: PlateEditor): PlateEditor => {
    const { getFragment } = editor;

    editor.getFragment = () => {
      const fragment = structuredClone(getFragment());

      const removeDiff = (node: TDescendant) => {
        propNames.forEach((propName) => {
          delete node[propName];
        });

        if (isElement(node)) node.children.forEach(removeDiff);
      };

      fragment.forEach(removeDiff);

      return fragment as any;
    };

    return editor;
  };
