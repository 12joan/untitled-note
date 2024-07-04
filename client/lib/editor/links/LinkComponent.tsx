import React, { useEffect, useMemo, useRef } from 'react';
import { useSelected } from 'slate-react';
import { copyText } from '~/lib/copyText';
import {
  findNodePath,
  focusEditor,
  getNodeString,
  isSelectionExpanded,
  PlateRenderElementProps,
  replaceNodeChildren,
  setNodes,
  TLinkElement,
  unwrapLink,
  useEditorReadOnly,
  usePlateSelectors,
  Value,
} from '~/lib/editor/plate';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { useElementSize } from '~/lib/useElementSize';
import CopyIcon from '~/components/icons/CopyIcon';
import DeleteIcon from '~/components/icons/DeleteIcon';
import EditIcon from '~/components/icons/EditIcon';
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon';
import { TippyInstance } from '~/components/Tippy';
import { FloatingToolbar, FloatingToolbarItem } from '../FloatingToolbar';
import { openLinkModal } from './LinkModal';
import { LinkData } from './types';

export const LinkComponent = ({
  editor,
  nodeProps,
  attributes,
  children,
  element,
}: PlateRenderElementProps<Value, TLinkElement>) => {
  // Re-render on any selection change
  usePlateSelectors().versionSelection();

  const isReadOnly = useEditorReadOnly();
  const findPath = () => findNodePath(editor, element)!;
  const tippyRef = useRef<TippyInstance>(null);

  const { href: unsafeHref = '', ...otherNodeProps } = nodeProps ?? {};

  /**
   * For narrow links, use zero open delay so that the link can be used as a
   * crossing-based trigger for the toolbar. For wider links that are
   * difficult to avoid crossing, use a non-zero open delay.
   * https://en.wikipedia.org/wiki/Crossing-based_interface
   */
  const [{ width: linkWidth }, linkRef] = useElementSize();
  const openDelay = linkWidth > 215 ? 75 : 0;

  const selected = useSelected();
  const openable = !isSelectionExpanded(editor);
  const controlledOpen = openable && selected;

  useEffect(() => {
    if (controlledOpen) {
      tippyRef.current?.show();
    } else {
      tippyRef.current?.hide();
    }
  }, [controlledOpen]);

  const safeHref = useMemo(() => {
    const url = new URL(unsafeHref);

    // eslint-disable-next-line no-script-url
    if (url.protocol === 'javascript:') {
      return 'about:blank';
    }

    return url.href;
  }, [unsafeHref]);

  const linkProps = {
    href: safeHref,
    rel: 'noopener noreferrer',
    target: '_blank',
  };

  const openLink = () =>
    Object.assign(document.createElement('a'), linkProps).click();

  const copyLink = () => copyText(safeHref);

  const updateLink = ({ url, text }: LinkData) => {
    const path = findPath();

    // Update url
    setNodes(editor, { url }, { at: path });

    // Update text
    replaceNodeChildren(editor, {
      at: path,
      nodes: [{ text }],
    });
  };

  const editLink = () => {
    const { url } = element;
    const text = getNodeString(element);

    openLinkModal(editor, {
      initialText: text === url ? '' : text,
      initialUrl: url,
      onConfirm: updateLink,
    });
  };

  const removeLink = () => {
    unwrapLink(editor, { at: findPath() });
    focusEditor(editor);
  };

  return (
    <span {...attributes}>
      <FloatingToolbar
        tippyProps={{
          ref: tippyRef,
          trigger: 'mouseenter click',
          delay: [openDelay, 0],
        }}
        items={
          openable && (
            <>
              <FloatingToolbarItem
                icon={OpenInNewTabIcon}
                label="Open link"
                onClick={openLink}
              />

              <FloatingToolbarItem
                icon={CopyIcon}
                label="Copy link"
                onClick={copyLink}
              />

              {!isReadOnly && (
                <>
                  <FloatingToolbarItem
                    icon={EditIcon}
                    label="Edit link"
                    onClick={editLink}
                  />

                  <FloatingToolbarItem
                    icon={DeleteIcon}
                    label="Remove link"
                    className="text-red-500 dark:text-red-400"
                    onClick={removeLink}
                  />
                </>
              )}
            </>
          )
        }
        containerProps={
          {
            'data-testid': 'link-toolbar',
          } as any
        }
      >
        <a
          ref={linkRef}
          {...linkProps}
          {...otherNodeProps}
          className={groupedClassNames({
            nodeProps: otherNodeProps.className,
            base: 'btn btn-link btn-no-rounded font-medium underline',
            diff: 'no-default-diff-rounded no-default-diff-text-color',
          })}
          children={children}
        />
      </FloatingToolbar>
    </span>
  );
};
