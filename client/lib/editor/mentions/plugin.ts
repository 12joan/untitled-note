import {
  createPluginFactory,
  TriggerComboboxPlugin,
  withTriggerCombobox,
} from '~/lib/editor/plate';

export const ELEMENT_MENTION = 'mention';
export const ELEMENT_MENTION_INPUT = 'mention_input';

export const createMentionPlugin = createPluginFactory<TriggerComboboxPlugin>({
  key: ELEMENT_MENTION,
  isElement: true,
  isInline: true,
  isMarkableVoid: true,
  isVoid: true,
  withOverrides: withTriggerCombobox,
  options: {
    trigger: '@',
    triggerPreviousCharPattern: /^\s?$/,
    createComboboxInput: (trigger) => ({
      children: [{ text: '' }],
      trigger,
      type: ELEMENT_MENTION_INPUT,
    }),
  },
  plugins: [
    {
      key: ELEMENT_MENTION_INPUT,
      isElement: true,
      isInline: true,
      isVoid: true,
    },
  ],
});
