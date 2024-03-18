import {
  createSectionedModal,
  SectionedModalOpenProps,
} from '~/lib/sectionedModal';
import AppearanceIcon from '~/components/icons/AppearanceIcon';
import ProjectDetailsIcon from '~/components/icons/ProjectDetailsIcon';
import SettingsIcon from '~/components/icons/SettingsIcon';
import {
  ActionsSection,
  AppearanceSection,
  ProjectDetailsSection,
} from '~/components/projectSettingsModalSections';

const sections = {
  nameAndIcon: {
    title: 'Project details',
    icon: ProjectDetailsIcon,
    component: ProjectDetailsSection,
  },
  appearance: {
    title: 'Appearance',
    icon: AppearanceIcon,
    component: AppearanceSection,
  },
  actions: {
    title: 'Actions',
    icon: SettingsIcon,
    component: ActionsSection,
  },
};

export type ProjectSettingsModalOpenProps = SectionedModalOpenProps<
  keyof typeof sections
>;

export const useProjectSettingsModal = createSectionedModal({
  id: 'project-settings-modal',
  title: 'Project settings',
  sections,
  sectionProps: {},
});
