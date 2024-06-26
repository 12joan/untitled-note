import React, { FormEvent, useEffect, useRef } from 'react';
import { useModal } from '~/lib/useModal';
import { useNormalizedInput } from '~/lib/useNormalizedInput';
import { ModalTitle, StyledModal, StyledModalProps } from '~/components/Modal';

export interface InputModalProps {
  title: string;
  inputLabel: string;
  inputPlaceholder: string;
  confirmLabel: string;
  cancelLabel?: string;
  initialValue?: string;
  required?: boolean;
  normalizeInput?: (value: string) => string;
  autoSelect?: boolean;
  onConfirm: (value: string) => void;
}

const InputModal = ({
  title,
  inputLabel,
  inputPlaceholder,
  confirmLabel,
  cancelLabel = 'Cancel',
  initialValue = '',
  required = true,
  normalizeInput = (value) => value.trim(),
  autoSelect = false,
  onConfirm,
  open,
  onClose,
}: InputModalProps & Omit<StyledModalProps, 'children'>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { value, props } = useNormalizedInput({
    initial: initialValue,
    normalize: normalizeInput,
  });

  useEffect(() => {
    if (autoSelect) {
      inputRef.current?.select();
    }
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onClose();
    onConfirm(value);
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <ModalTitle children={title} />

        <label className="block space-y-2">
          <div className="font-medium select-none">{inputLabel}</div>

          <input
            ref={inputRef}
            type="text"
            {...props}
            required={required}
            className="text-input text-input-modal"
            placeholder={inputPlaceholder}
          />
        </label>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="btn btn-rect btn-modal-secondary"
            onClick={onClose}
          >
            {cancelLabel}
          </button>

          <button type="submit" className="btn btn-rect btn-primary">
            {confirmLabel}
          </button>
        </div>
      </form>
    </StyledModal>
  );
};

export const useInputModal = (props: InputModalProps) =>
  useModal((modalProps) => <InputModal {...modalProps} {...props} />);
