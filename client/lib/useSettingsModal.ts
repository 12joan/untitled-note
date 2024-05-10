import {
  createSectionedModal,
  SectionedModalOpenProps,
} from '~/lib/sectionedModal';
import AppearanceIcon from '~/components/icons/AppearanceIcon';
import KeyboardShortcutsIcon from '~/components/icons/KeyboardShortcutsIcon';
import SettingsIcon from '~/components/icons/SettingsIcon';
import {
  AppearanceSection,
  GeneralSection,
  KeyboardShortcutsSection,
} from '~/components/settingsModalSections';

const sections = {
  general: {
    title: 'General',
    icon: SettingsIcon,
    component: GeneralSection,
  },
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
};

export type SettingsModalOpenProps = SectionedModalOpenProps<
  keyof typeof sections
>;

export const useSettingsModal = createSectionedModal({
  id: 'settings-modal',
  title: 'User preferences',
  sections,
  sectionProps: {},
});
