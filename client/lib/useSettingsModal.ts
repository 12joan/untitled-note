import {
  createSectionedModal,
  SectionedModalOpenProps,
} from '~/lib/sectionedModal';
import KeyboardShortcutsIcon from '~/components/icons/KeyboardShortcutsIcon';
import { KeyboardShortcutsSection } from '~/components/settingsModalSections';

export type SettingsModalOpenProps = SectionedModalOpenProps;

export const useSettingsModal = createSectionedModal('settings-modal', {
  emailAndPassword: {
    title: 'Keyboard shortcuts',
    icon: KeyboardShortcutsIcon,
    component: KeyboardShortcutsSection,
  },
});
