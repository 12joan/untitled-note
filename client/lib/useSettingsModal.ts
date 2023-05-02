import { createSectionedModal, SectionedModalOpenProps } from '~/lib/sectionedModal';
import { KeyboardShortcutsSection } from '~/components/settingsModalSections';
import KeyboardShortcutsIcon from '~/components/icons/KeyboardShortcutsIcon';

export type SettingsModalOpenProps = SectionedModalOpenProps;

export const useSettingsModal = createSectionedModal('settings-modal', {
  emailAndPassword: {
    title: 'Keyboard shortcuts',
    icon: KeyboardShortcutsIcon,
    component: KeyboardShortcutsSection,
  },
});
