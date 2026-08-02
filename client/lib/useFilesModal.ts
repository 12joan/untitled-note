import { FileStorageSection } from '~/components/filesModalSections';
import StorageIcon from '~/components/icons/StorageIcon';
import {
  createSectionedModal,
  type SectionedModalOpenProps,
} from '~/lib/sectionedModal';

const sections = {
  fileStorage: {
    title: 'File storage',
    icon: StorageIcon,
    component: FileStorageSection,
  },
};

export type FilesModalOpenProps = SectionedModalOpenProps<
  keyof typeof sections
>;
export const useFilesModal = createSectionedModal({
  id: 'files-modal',
  title: 'File storage',
  sections,
  sectionProps: {},
});
