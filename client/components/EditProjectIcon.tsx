import React, { ChangeEvent, useRef, useState } from 'react';
import emojiData from '@emoji-mart/data';
import EmojiPicker from '@emoji-mart/react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import { isHotkey } from '@udecode/plate';
import { useAppContext } from '~/lib/appContext';
import { filesize } from '~/lib/filesize';
import {
  handleRemoveProjectImageError,
  handleUploadFileError,
} from '~/lib/handleErrors';
import { orDefaultFuture, unwrapFuture } from '~/lib/monads';
import {
  removeProjectImage,
  uploadProjectImage,
} from '~/lib/projectImageActions';
import { mergeRefs } from '~/lib/refUtils';
import { Project } from '~/lib/types';
import { useCSPNonce } from '~/lib/useCSPNonce';
import { useEventListener } from '~/lib/useEventListener';
import { useFocusOut } from '~/lib/useFocusOut';
import { useLocalProject } from '~/lib/useLocalProject';
import { useOverrideable } from '~/lib/useOverrideable';
import { ProjectIcon } from '~/components/ProjectIcon';
import { ReplaceWithSpinner } from '~/components/ReplaceWithSpinner';

export const EditProjectIcon = () => {
  const [localProject, updateProject] = useLocalProject();

  const [hasImage, overrideHasImage] = useOverrideable(
    !!localProject.image_url
  );

  const [imageFormState, setImageFormState] = useState<
    'idle' | 'uploading' | 'removing'
  >('idle');

  return (
    <div className="space-y-2">
      <h4 className="select-none h3">Project icon</h4>

      <div className="space-y-2">
        <h5 className="select-none h4">Image</h5>

        <ImageForm
          hasImage={hasImage}
          overrideHasImage={overrideHasImage}
          state={imageFormState}
          setState={setImageFormState}
        />
      </div>

      {!hasImage && imageFormState === 'idle' && (
        <div className="space-y-2">
          <h5 className="select-none h4">Emoji</h5>

          <EmojiForm project={localProject} updateProject={updateProject} />
        </div>
      )}

      <div className="space-y-2">
        <h5 className="select-none h4">Background colour</h5>

        <BackgroundColourForm
          project={localProject}
          updateProject={updateProject}
          hasImage={hasImage}
        />
      </div>

      <div className="space-y-2">
        <h5 className="select-none h4">Preview</h5>

        <ProjectIcon
          project={localProject}
          className="size-12 rounded-lg shadow text-xl select-none dark:border"
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
  const projectId = useAppContext('projectId');
  const futureRemainingQuota = useAppContext('futureRemainingQuota');
  const toggleAccountModal = useAppContext('toggleAccountModal');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFileStorage = () =>
    toggleAccountModal({
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
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelected}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-rect btn-modal-secondary relative"
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
            className="btn btn-rect btn-modal-secondary text-red-500 dark:text-red-400"
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
          <div>
            <button
              type="button"
              className="text-sm btn btn-link-subtle"
              onClick={showFileStorage}
            >
              {filesize(remainingQuota)} available
            </button>
          </div>
        ),
      })}
    </>
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

  useEventListener(
    document,
    'keydown',
    (event) => {
      if (isHotkey('escape', event)) {
        if (pickerVisible) {
          event.preventDefault();
          closePicker();
        }
      }
    },
    [pickerVisible]
  );

  const [focusOutRef, focusOutProps] = useFocusOut((event) => {
    if (pickerVisible) {
      closePicker(event.relatedTarget === null);
    }
  });

  const {
    x: pickerX,
    y: pickerY,
    reference: floatingReferenceRef,
    floating: pickerRef,
    strategy: pickerPosition,
  } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(10),
      shift({ padding: 12 }),
      flip({
        fallbackPlacements: ['right'],
        fallbackStrategy: 'initialPlacement',
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const nonce = useCSPNonce();

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          ref={mergeRefs([buttonRef, floatingReferenceRef])}
          type="button"
          className="btn btn-rect btn-modal-secondary"
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
            className="btn btn-rect btn-modal-secondary text-red-700 dark:text-red-400"
            onClick={() => setEmoji(null)}
          >
            Remove emoji
          </button>
        )}
      </div>

      {pickerVisible && (
        <div
          ref={mergeRefs([pickerRef, focusOutRef])}
          {...focusOutProps}
          className="z-20 pb-5"
          style={{
            position: pickerPosition,
            left: pickerX ?? 0,
            top: pickerY ?? 0,
          }}
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
    </>
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
    <>
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
        <p>The background colour affects transparent areas of the image.</p>
      )}
    </>
  );
};
