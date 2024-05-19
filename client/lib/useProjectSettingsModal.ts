import {
  createSectionedModal,
  SectionedModalOpenProps,
} from '~/lib/sectionedModal';
import AppearanceIcon from '~/components/icons/AppearanceIcon';
import DeleteIcon from '~/components/icons/DeleteIcon';
import ProjectDetailsIcon from '~/components/icons/ProjectDetailsIcon';
import {
  AppearanceSection,
  DeleteSection,
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
    title: 'Delete project',
    icon: DeleteIcon,
    component: DeleteSection,
    variant: 'danger',
  },
} as const;

export type ProjectSettingsModalOpenProps = SectionedModalOpenProps<
  keyof typeof sections
>;

export const useProjectSettingsModal = createSectionedModal({
  id: 'project-settings-modal',
  title: 'Project settings',
  sections,
  sectionProps: {},
});
