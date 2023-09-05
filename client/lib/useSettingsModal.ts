import {
  createSectionedModal,
  SectionedModalOpenProps,
} from '~/lib/sectionedModal';
import AppearanceIcon from '~/components/icons/AppearanceIcon';
import KeyboardShortcutsIcon from '~/components/icons/KeyboardShortcutsIcon';
import {
  AppearanceSection,
  KeyboardShortcutsSection,
} from '~/components/settingsModalSections';

export type SettingsModalOpenProps = SectionedModalOpenProps;

export const useSettingsModal = createSectionedModal(
  'settings-modal',
  {
    appearance: {
      title: 'Appearance',
      icon: AppearanceIcon,
      component: AppearanceSection,
    },
    keyboardShortcuts: {
      title: 'Keyboard shortcuts',
      icon: KeyboardShortcutsIcon,
      component: KeyboardShortcutsSection,
    },
  },
  {}
);
