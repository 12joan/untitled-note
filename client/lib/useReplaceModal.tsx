import React, { useState } from 'react';
import {
  replaceInDocument,
  replaceInProject,
  ReplaceOptions,
  ReplaceResult,
} from '~/lib/apis/replace';
import { useAppContext } from '~/lib/appContext';
import { handleReplaceError } from '~/lib/handleErrors';
import { pluralize } from '~/lib/pluralize';
import { createToast } from '~/lib/toasts';
import { useModal } from '~/lib/useModal';
import { ModalTitle, StyledModal, StyledModalProps } from '~/components/Modal';
import { ReplaceWithSpinner } from '~/components/ReplaceWithSpinner';
import { Tooltip } from '~/components/Tooltip';

export interface ReplaceModalProps {
  documentId: number;
}

const ReplaceModal = ({
  documentId,
  open,
  onClose,
}: ReplaceModalProps & Omit<StyledModalProps, 'children'>) => {
  const projectId = useAppContext('projectId');

  const [findValue, setFindValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');
  const findValueIsValid = /[^\s]/.test(findValue);

  const [replaceScope, setReplaceScope] = useState<'document' | 'project'>(
    'document'
  );

  const [isReplacing, setIsReplacing] = useState(false);

  const handleReplace = () => {
    const options: ReplaceOptions = {
      find: findValue,
      replace: replaceValue,
    };

    const replacePromise: Promise<ReplaceResult> = {
      document: () => replaceInDocument(projectId, documentId, options),
      project: () => replaceInProject(projectId, options),
    }[replaceScope]();

    setIsReplacing(true);

    /* Delay to give the changes time to propagate before returning to the
     * document. If the current document has been changed, the editor will
     * most likely refresh before this anyway, closing the modal.
     */
    handleReplaceError(replacePromise).then(
      ({ occurrences, documents = 1 }) =>
        setTimeout(() => {
          createToast({
            title: occurrences > 0 ? 'Replace successful' : 'No matches found',
            message: `Replaced ${pluralize(
              occurrences,
              'occurrence'
            )} in ${pluralize(documents, 'document')}.`,
            autoClose: 'fast',
          });

          setIsReplacing(false);
          onClose();
        }, 250),
      () => setIsReplacing(false)
    );
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <div className="space-y-5">
        <ModalTitle>Replace text</ModalTitle>

        <label className="block space-y-2">
          <div className="font-medium select-none">Find</div>

          <input
            type="text"
            required
            className="text-input text-input-modal"
            placeholder="Find text"
            value={findValue}
            onChange={(event) => setFindValue(event.target.value)}
          />
        </label>

        <label className="block space-y-2">
          <div className="font-medium select-none">Replace</div>

          <input
            type="text"
            className="text-input text-input-modal"
            placeholder="Replace text"
            value={replaceValue}
            onChange={(event) => setReplaceValue(event.target.value)}
          />
        </label>

        {/* Radio buttons */}
        <div className="block space-y-2">
          <div className="font-medium select-none">Find and replace in</div>

          {Object.entries({
            document: 'Current document',
            project: 'All documents in project',
          }).map(([value, label]) => (
            <label key={value} className="block space-x-2 select-none">
              <input
                type="radio"
                name="scope"
                checked={replaceScope === value}
                onChange={() =>
                  setReplaceScope(value as 'document' | 'project')
                }
              />

              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="btn btn-rect btn-modal-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <Tooltip content="Find cannot be empty" disabled={findValueIsValid}>
            <div>
              <button
                type="button"
                className="btn btn-rect btn-primary"
                disabled={!findValueIsValid}
                onClick={handleReplace}
              >
                <ReplaceWithSpinner
                  isSpinner={isReplacing}
                  spinnerAriaLabel="Replacing text"
                >
                  Replace
                </ReplaceWithSpinner>
              </button>
            </div>
          </Tooltip>
        </div>
      </div>
    </StyledModal>
  );
};

export const useReplaceModal = (props: ReplaceModalProps) =>
  useModal((modalProps) => <ReplaceModal {...modalProps} {...props} />);
