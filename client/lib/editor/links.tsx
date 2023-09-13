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
  focusEditor,
  getAboveNode,
  getEditorString,
  getSelectionText,
  insertLink,
  isSelectionExpanded,
  PlateEditor,
  PlateRenderElementProps,
  someNode,
  TLinkElement,
  unwrapLink,
  upsertLink,
  Value,
} from '@udecode/plate';
import { useSelected } from 'slate-react';
import { useModal } from '~/lib/useModal';
import { useNormalizedInput } from '~/lib/useNormalizedInput';
import DeleteIcon from '~/components/icons/DeleteIcon';
import EditIcon from '~/components/icons/EditIcon';
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon';
import { ModalTitle, StyledModal, StyledModalProps } from '~/components/Modal';
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
            className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
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
            className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
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

export const useToggleLink = (editor: PlateEditor) => {
  const openModal = useOpenLinkModal();

  const toggleLink = () => {
    if (isLinkInSelection(editor)) {
      unwrapLink(editor);
    } else {
      openModal({
        initialText: getSelectionText(editor),
        onConfirm: (args) => insertLink(editor, args),
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
}: PlateRenderElementProps<Value, TLinkElement>) => {
  const [selectedLink, selectedLinkPath] = getAboveNode<TLinkElement>(editor, {
    match: { type: ELEMENT_LINK },
  }) || [undefined, undefined];
  const selected = useSelected();
  const selectionCollapsed = !isSelectionExpanded(editor);
  const open = selected && selectionCollapsed && selectedLink !== undefined;

  const safeHref = useMemo(() => {
    const unsafeHref = nodeProps!.href;
    const url = new URL(unsafeHref);

    // eslint-disable-next-line no-script-url
    if (url.protocol === 'javascript:') {
      return 'about:blank';
    }

    return url.href;
  }, [nodeProps!.href]);

  const linkProps = {
    href: safeHref,
    rel: 'noopener noreferrer',
    target: '_blank',
  };

  const openLink = () =>
    Object.assign(document.createElement('a'), linkProps).click();

  const openModal = useOpenLinkModal();

  const editLink = () => {
    const { url } = selectedLink!;
    const text = getEditorString(editor, selectedLinkPath);

    openModal({
      initialText: text === url ? '' : text,
      initialUrl: url,
      onConfirm: (args) => upsertLink(editor, args),
    });
  };

  const removeLink = () => {
    unwrapLink(editor);
    focusEditor(editor);
  };

  return (
    <span {...attributes}>
      <FloatingToolbar
        open={open}
        items={
          <>
            <FloatingToolbarItem
              icon={OpenInNewTabIcon}
              label="Open link"
              onClick={openLink}
            />

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
        }
      >
        <a
          {...linkProps}
          className="btn btn-link font-medium underline"
          children={children}
        />
      </FloatingToolbar>
    </span>
  );
};
