import React, { useState, useRef } from 'react'
import { useFloating, offset, shift } from '@floating-ui/react-dom'
import emojiData from '@emoji-mart/data'
import EmojiPicker from '@emoji-mart/react'

import { useContext } from '~/lib/context'
import useIsMounted from '~/lib/useIsMounted'
import useOverrideable from '~/lib/useOverrideable'
import { uploadProjectImage, removeProjectImage } from '~/lib/projectImageActions'
import ProjectsAPI from '~/lib/resources/ProjectsAPI'
import retry from '~/lib/retry'
import {
  handleUploadProjectImageError,
  handleRemoveProjectImageError,
  handleUpdateProjectError,
} from '~/lib/handleErrors'
import multiplexRefs from '~/lib/multiplexRefs'
import useGlobalKeyboardShortcut from '~/lib/useGlobalKeyboardShortcut'

import ReplaceWithSpinner from '~/components/ReplaceWithSpinner'

const EditProjectIcon = () => {
  const { project } = useContext()
  const isMounted = useIsMounted()

  const [localProject, setLocalProject] = useOverrideable(project)
  const [hasImage, overrideHasImage] = useOverrideable(!!localProject.image_url)

  const [imageFormState, setImageFormState] = useState('idle')
  const [updatingProject, setUpdatingProject] = useState(false)

  const updateProject = params => {
    setUpdatingProject(true)
    setLocalProject({ ...localProject, ...params })

    handleUpdateProjectError(
      retry(
        () => ProjectsAPI.update({
          id: project.id,
          ...params,
        }),
        { shouldRetry: isMounted }
      )
    ).catch(error => {
      console.error(error)
      setLocalProject(project)
    }).finally(() => setUpdatingProject(false))
  }

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

        {(!hasImage && imageFormState === 'idle') && (
          <EmojiForm
            project={localProject}
            updateProject={updateProject}
          />
        )}

        <BackgroundColourForm
          project={localProject}
          updateProject={updateProject}
          hasImage={hasImage}
        />

      </div>
    </div>
  )
}

const ImageForm = ({ hasImage, overrideHasImage, state, setState }) => {
  const fileInputRef = useRef(null)

  const { project } = useContext()

  const isUploading = state === 'uploading'
  const isRemoving = state === 'removing'
  const isBusy = isUploading || isRemoving

  const showFileSelector = () => {
    const fileInput = fileInputRef.current
    fileInput.value = null
    fileInput.click()
  }

  const handleFileSelected = event => {
    const originalFile = event.target.files[0]

    if (!originalFile) {
      return
    }

    setState('uploading')

    handleUploadProjectImageError(
      uploadProjectImage(project, originalFile).then(() => overrideHasImage(true))
    ).finally(() => setState('idle'))
  }

  const handleRemoveImage = () => {
    setState('removing')

    handleRemoveProjectImageError(
      removeProjectImage(project).then(() => overrideHasImage(false))
    ).finally(() => setState('idle'))
  }

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

      <div className="space-x-2">
        <button
          type="button"
          className="btn btn-rect btn-secondary relative"
          onClick={showFileSelector}
          disabled={isBusy}
        >
          <ReplaceWithSpinner isSpinner={isUploading} spinnerAriaLabel="Uploading image">
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
            <ReplaceWithSpinner isSpinner={isRemoving} spinnerAriaLabel="Removing image">
              Remove image
            </ReplaceWithSpinner>
          </button>
        )}
      </div>
    </div>
  )
}

const EmojiForm = ({ project, updateProject }) => {
  const buttonRef = useRef()

  const { emoji } = project
  const hasEmoji = !!emoji
  const setEmoji = emoji => updateProject({ emoji })

  const [pickerVisible, setPickerVisible] = useState(false)

  const closePicker = (focusButton = true) => {
    setPickerVisible(false)

    if (focusButton) {
      buttonRef.current.focus()
    }
  }

  useGlobalKeyboardShortcut('Escape', event => {
    if (pickerVisible) {
      event.preventDefault()
      closePicker()
    }
  }, [pickerVisible])

  const handleBlur = event => {
    if (pickerVisible && !event.currentTarget.contains(event.relatedTarget)) {
      closePicker(event.relatedTarget === null)
    }
  }

  const {
    x: pickerX,
    y: pickerY,
    reference: floatingReferenceRef,
    floating: pickerRef,
    strategy: pickerPosition,
  } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(10), shift()],
  })

  return (
    <div className="space-y-2">
      <h3 className="font-medium select-none">Emoji</h3>

      <div>
        <button
          ref={multiplexRefs([buttonRef, floatingReferenceRef])}
          type="button"
          className="btn btn-rect btn-secondary"
          onClick={event => {
            // Prevent the picker from registering a click outside
            event.stopPropagation()
            setPickerVisible(true)
          }}
        >
          {hasEmoji ? `${emoji} Change emoji` : 'Choose emoji'}
        </button>

        {hasEmoji && (
          <button
            type="button"
            className="ml-2 btn btn-rect btn-secondary text-red-500 dark:text-red-400"
            onClick={() => setEmoji(null)}
          >
            Remove emoji
          </button>
        )}

        {pickerVisible && (
          <div
            ref={pickerRef}
            className="z-20 pb-5"
            style={{
              position: 'absolute',
              left: pickerX,
              top: pickerY,
            }}
            onBlur={handleBlur}
            onMouseDown={event => {
              // Prevent blur when clicking inside picker (WebKit)
              event.preventDefault()
            }}
          >
            <EmojiPicker
              data={emojiData}
              autoFocus
              onEmojiSelect={({ native: emoji }) => {
                closePicker()
                setEmoji(emoji)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const BackgroundColourForm = ({ project, updateProject, hasImage }) => {
  const { background_colour: backgroundColour } = project
  const setBackgroundColor = colour => updateProject({ background_colour: colour })

  return (
    <div className="space-y-2">
      <h3 className="font-medium select-none">Background colour</h3>

      <div className="flex items-center space-x-2">
        {[['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([value, label]) => (
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
  )
}

export default EditProjectIcon
