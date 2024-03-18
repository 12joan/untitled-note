import React, {
  createContext,
  FormEvent,
  useContext as reactUseContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ELEMENT_LINK,
  findNodePath,
  focusEditor,
  getNodeString,
  getSelectionText,
  insertLink,
  isSelectionExpanded,
  PlateEditor,
  PlateRenderElementProps,
  replaceNodeChildren,
  setNodes,
  someNode,
  TLinkElement,
  unwrapLink,
  useEditorReadOnly,
  useEditorRef,
  usePlateSelectors,
  Value,
} from '@udecode/plate';
import { useSelected } from 'slate-react';
import { copyText } from '~/lib/copyText';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { useModal } from '~/lib/useModal';
import { useNormalizedInput } from '~/lib/useNormalizedInput';
import CopyIcon from '~/components/icons/CopyIcon';
import DeleteIcon from '~/components/icons/DeleteIcon';
import EditIcon from '~/components/icons/EditIcon';
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon';
import { ModalTitle, StyledModal, StyledModalProps } from '~/components/Modal';
import { TippyInstance } from '~/components/Tippy';
import { useElementSize } from '../useElementSize';
import { FloatingToolbar, FloatingToolbarItem } from './FloatingToolbar';

export const isLinkInSelection = (editor: PlateEditor) =>
  someNode(editor, { match: { type: ELEMENT_LINK } });

type LinkData = {
  url: string;
  text: string;
};

export interface LinkModalProps {
  initialText?: string;
  initialUrl?: string;
  onConfirm: (data: LinkData) => void;
}

const LinkModal = ({
  open,
  onClose,
  initialText = '',
  initialUrl = '',
  onConfirm,
}: LinkModalProps & Omit<StyledModalProps, 'children'>) => {
  const textInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (initialText.trim().length > 0
      ? urlInputRef
      : textInputRef
    ).current?.focus();
  }, []);

  const [text, setText] = useState(initialText);

  const { value: url, props: urlProps } = useNormalizedInput({
    initial: initialUrl,
    normalize: (url) =>
      url.trim() !== '' && url.match(/^[^:]+\./) ? `https://${url}` : url,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const textOrUrl = text.trim() === '' ? url : text;
    onClose();
    onConfirm({ url, text: textOrUrl });
  };

  const action = initialUrl === '' ? 'Add link' : 'Edit link';

  return (
    <StyledModal open={open} onClose={onClose}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <ModalTitle>{action}</ModalTitle>

        <label className="block space-y-2">
          <div className="font-medium select-none">Text</div>

          <input
            ref={textInputRef}
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="text-input text-input-modal"
            placeholder="Optional"
          />
        </label>

        <label className="block space-y-2">
          <div className="font-medium select-none">Link</div>

          <input
            ref={urlInputRef}
            type="url"
            {...urlProps}
            required
            data-test="hello"
            pattern="(https?|mailto|tel|web\+):.*"
            className="text-input text-input-modal"
            placeholder="https://example.com/"
          />
        </label>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="btn btn-rect btn-modal-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="submit" className="btn btn-rect btn-primary">
            {action}
          </button>
        </div>
      </form>
    </StyledModal>
  );
};

type OpenLinkModalFn = (props: LinkModalProps) => void;

const LinkModalContext = createContext<OpenLinkModalFn | null>(null);

export const useLinkModalProvider = () => {
  const { modal, open } = useModal<LinkModalProps>((modalProps, openProps) => (
    <LinkModal {...modalProps} {...openProps} />
  ));

  const withLinkModalProvider = (children: JSX.Element): JSX.Element => (
    <>
      {modal}

      <LinkModalContext.Provider value={open} children={children} />
    </>
  );

  return withLinkModalProvider;
};

const useOpenLinkModal = (): OpenLinkModalFn => {
  const openLinkModal = reactUseContext(LinkModalContext);

  if (!openLinkModal) {
    throw new Error('useOpenLinkModal must be used within a LinkModalContext');
  }

  return openLinkModal;
};

export const useToggleLink = () => {
  const editorStatic = useEditorRef();
  const openModal = useOpenLinkModal();

  const toggleLink = () => {
    if (isLinkInSelection(editorStatic)) {
      unwrapLink(editorStatic);
    } else {
      openModal({
        initialText: getSelectionText(editorStatic),
        onConfirm: (args) => insertLink(editorStatic, args),
      });
    }
  };

  return toggleLink;
};

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

  const openModal = useOpenLinkModal();

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

    openModal({
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
