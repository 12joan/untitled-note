import {
  getLocalStorage,
  setLocalStorage,
  useLocalStorage,
} from '~/lib/browserStorage';

const STORAGE_KEY = 'editorFontSize';
const DEFAULT_FONT_SIZE = 100;
const MIN_FONT_SIZE = 30;
const MAX_FONT_SIZE = 200;
const FONT_SIZE_INCREMENT = 10;

export const useEditorFontSize = () =>
  useLocalStorage<number>(STORAGE_KEY, DEFAULT_FONT_SIZE);

export const useEditorFontSizeCSSValue = () => `${useEditorFontSize()}%`;

const getEditorFontSize = () =>
  getLocalStorage<number>(STORAGE_KEY) ?? DEFAULT_FONT_SIZE;

const setEditorFontSize = (value: number) => {
  setLocalStorage(
    STORAGE_KEY,
    Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, value))
  );
};

export const increaseEditorFontSize = () =>
  setEditorFontSize(getEditorFontSize() + FONT_SIZE_INCREMENT);

export const decreaseEditorFontSize = () =>
  setEditorFontSize(getEditorFontSize() - FONT_SIZE_INCREMENT);

export const resetEditorFontSize = () => setEditorFontSize(DEFAULT_FONT_SIZE);
