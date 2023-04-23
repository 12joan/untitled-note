import React, { ChangeEvent, FocusEvent, useRef, useState } from 'react';
import emojiData from '@emoji-mart/data';
import EmojiPicker from '@emoji-mart/react';
import { offset, shift, useFloating } from '@floating-ui/react-dom';
import { updateProject as updateProjectAPI } from '~/lib/apis/project';
import { useContext } from '~/lib/context';
import { useCSPNonce } from '~/lib/useCSPNonce';
import { filesize } from '~/lib/filesize';
import {
  handleRemoveProjectImageError,
  handleUpdateProjectError,
  handleUploadFileError,
} from '~/lib/handleErrors';
import { Future, orDefaultFuture, unwrapFuture } from '~/lib/monads';
import {
  removeProjectImage,
  uploadProjectImage,
} from '~/lib/projectImageActions';
import { mergeRefs } from '~/lib/refUtils';
import { retry } from '~/lib/retry';
import { Project } from '~/lib/types';
import { AccountModalOpenProps } from '~/lib/useAccountModal';
import { useGlobalKeyboardShortcut } from '~/lib/useGlobalKeyboardShortcut';
import { useIsMounted } from '~/lib/useIsMounted';
import { useOverrideable } from '~/lib/useOverrideable';
import { ReplaceWithSpinner } from '~/components/ReplaceWithSpinner';

export const EditProjectIcon = () => {
  const { project } = useContext() as { project: Project };
  const isMounted = useIsMounted();

  const [localProject, setLocalProject] = useOverrideable(project);
  const [hasImage, overrideHasImage] = useOverrideable(
    !!localProject.image_url
  );

  const [imageFormState, setImageFormState] = useState<
    'idle' | 'uploading' | 'removing'
  >('idle');

  const updateProject = (params: Partial<Project>) => {
    setLocalProject({
      ...localProject,
      ...params,
    });

    handleUpdateProjectError(
      retry(() => updateProjectAPI(project.id, params), {
        shouldRetry: isMounted,
      })
    ).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      setLocalProject(project);
    });
  };

  return (
    <div>
      <h2 className="font-medium select-none mb-2">Project icon</h2>

      <div className="border rounded-lg p-3 space-y-5">
        <ImageForm
          hasImage={hasImage}
          overrideHasImage={overrideHasImage}
          state={imageFormState}
          setState={setImageFormState}
        />

        {!hasImage && imageFormState === 'idle' && (
          <EmojiForm project={localProject} updateProject={updateProject} />
        )}

        <BackgroundColourForm
          project={localProject}
          updateProject={updateProject}
          hasImage={hasImage}
        />
      </div>
    </div>
  );
};

export interface ImageFormProps {
  hasImage: boolean;
  overrideHasImage: (hasImage: boolean) => void;
  state: 'idle' | 'uploading' | 'removing';
  setState: (state: 'idle' | 'uploading' | 'removing') => void;
}

const ImageForm = ({
  hasImage,
  overrideHasImage,
  state,
  setState,
}: ImageFormProps) => {
  const { projectId, futureRemainingQuota, showAccountModal } =
    useContext() as {
      projectId: number;
      futureRemainingQuota: Future<number>;
      showAccountModal: (props: AccountModalOpenProps) => void;
    };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFileStorage = () =>
    showAccountModal({
      initialSection: 'fileStorage',
    });

  const isUploading = state === 'uploading';
  const isRemoving = state === 'removing';
  const isBusy = isUploading || isRemoving;

  const showFileSelector = () => {
    const fileInput = fileInputRef.current;
    fileInput?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const originalFile = event.target.files?.[0];

    if (!originalFile) {
      return;
    }

    setState('uploading');

    handleUploadFileError(
      uploadProjectImage({
        projectId,
        file: originalFile,
        availableSpace: orDefaultFuture(futureRemainingQuota, Infinity),
        showFileStorage,
      }).then(() => overrideHasImage(true))
    ).finally(() => setState('idle'));
  };

  const handleRemoveImage = () => {
    setState('removing');

    handleRemoveProjectImageError(
      removeProjectImage(projectId).then(() => overrideHasImage(false))
    ).finally(() => setState('idle'));
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelected}
      />

      <h3 className="font-medium select-none mb-2">Image</h3>

      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          className="btn btn-rect btn-secondary relative"
          onClick={showFileSelector}
          disabled={isBusy}
        >
          <ReplaceWithSpinner
            isSpinner={isUploading}
            spinnerAriaLabel="Uploading image"
          >
            {hasImage ? 'Replace' : 'Upload'} image
          </ReplaceWithSpinner>
        </button>

        {hasImage && (
          <button
            type="button"
            className="btn btn-rect btn-secondary text-red-500 dark:text-red-400"
            onClick={handleRemoveImage}
            disabled={isBusy}
          >
            <ReplaceWithSpinner
              isSpinner={isRemoving}
              spinnerAriaLabel="Removing image"
            >
              Remove image
            </ReplaceWithSpinner>
          </button>
        )}
      </div>

      {unwrapFuture(futureRemainingQuota, {
        pending: null,
        resolved: (remainingQuota) => (
          <button
            type="button"
            className="text-sm text-slate-500 dark:text-slate-400 btn btn-link-subtle"
            onClick={showFileStorage}
          >
            {filesize(remainingQuota)} available
          </button>
        ),
      })}
    </div>
  );
};

export interface EmojiFormProps {
  project: Project;
  updateProject: (params: Partial<Project>) => void;
}

const EmojiForm = ({ project, updateProject }: EmojiFormProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { emoji } = project;
  const hasEmoji = !!emoji;
  const setEmoji = (emoji: Project['emoji']) => updateProject({ emoji });

  const [pickerVisible, setPickerVisible] = useState(false);

  const closePicker = (focusButton = true) => {
    setPickerVisible(false);

    if (focusButton) {
      buttonRef.current?.focus();
    }
  };

  useGlobalKeyboardShortcut(
    'Escape',
    (event) => {
      if (pickerVisible) {
        event.preventDefault();
        closePicker();
      }
    },
    [pickerVisible]
  );

  const handleBlur = (event: FocusEvent) => {
    if (pickerVisible && !event.currentTarget.contains(event.relatedTarget)) {
      closePicker(event.relatedTarget === null);
    }
  };

  const {
    x: pickerX,
    y: pickerY,
    reference: floatingReferenceRef,
    floating: pickerRef,
    strategy: pickerPosition,
  } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(10), shift()],
  });

  const nonce = useCSPNonce();

  return (
    <div className="space-y-2">
      <h3 className="font-medium select-none">Emoji</h3>

      <div>
        <div className="flex flex-wrap gap-2">
          <button
            ref={mergeRefs([buttonRef, floatingReferenceRef])}
            type="button"
            className="btn btn-rect btn-secondary"
            onClick={(event) => {
              // Prevent the picker from registering a click outside
              event.stopPropagation();
              setPickerVisible(true);
            }}
          >
            {hasEmoji ? `${emoji} Change emoji` : 'Choose emoji'}
          </button>

          {hasEmoji && (
            <button
              type="button"
              className="btn btn-rect btn-secondary text-red-500 dark:text-red-400"
              onClick={() => setEmoji(null)}
            >
              Remove emoji
            </button>
          )}
        </div>

        {pickerVisible && (
          <div
            ref={pickerRef}
            className="z-20 pb-5"
            style={{
              position: pickerPosition,
              left: pickerX ?? 0,
              top: pickerY ?? 0,
            }}
            onBlur={handleBlur}
            onMouseDown={(event) => {
              // Prevent blur when clicking inside picker (WebKit)
              event.preventDefault();
            }}
          >
            <EmojiPicker
              data={emojiData}
              autoFocus
              onEmojiSelect={({ native: emoji }: { native: string }) => {
                closePicker();
                setEmoji(emoji);
              }}
              styleProps={{
                nonce,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export interface BackgroundColourFormProps {
  project: Project;
  updateProject: (params: Partial<Project>) => void;
  hasImage: boolean;
}

const BackgroundColourForm = ({
  project,
  updateProject,
  hasImage,
}: BackgroundColourFormProps) => {
  const { background_colour: backgroundColour } = project;

  const setBackgroundColor = (colour: Project['background_colour']) =>
    updateProject({ background_colour: colour });

  return (
    <div className="space-y-2">
      <h3 className="font-medium select-none">Background colour</h3>

      <div className="flex flex-wrap gap-2 items-center">
        {[
          ['auto', 'Auto'],
          ['light', 'Light'],
          ['dark', 'Dark'],
        ].map(([value, label]) => (
          <label key={value} className="flex items-center space-x-2">
            <input
              type="radio"
              name="background_colour"
              value={value}
              checked={backgroundColour === value}
              onChange={() => setBackgroundColor(value)}
            />

            <span>{label}</span>
          </label>
        ))}
      </div>

      {hasImage && (
        <p className="text-slate-500 dark:text-slate-400">
          The background colour affects transparent areas of the image.
        </p>
      )}
    </div>
  );
};
