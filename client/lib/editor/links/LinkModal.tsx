import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { PlateEditor } from '~/lib/editor/plate';
import { useModal } from '~/lib/useModal';
import { useNormalizedInput } from '~/lib/useNormalizedInput';
import { ModalTitle, StyledModal, StyledModalProps } from '~/components/Modal';
import { dispatchEditorEvent, useEditorEvent } from '../imperativeEvents';
import { LinkModalProps } from './types';

export const useLinkModal = () => {
  const { modal, open } = useModal<LinkModalProps>((modalProps, openProps) => (
    <LinkModal {...modalProps} {...openProps} />
  ));

  useEditorEvent('linkModal:open', open);

  return modal;
};

export const openLinkModal = (editor: PlateEditor, props: LinkModalProps) =>
  dispatchEditorEvent(editor, 'linkModal:open', props);

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
