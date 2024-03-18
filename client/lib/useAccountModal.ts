import {
  createSectionedModal,
  SectionedModalOpenProps,
} from '~/lib/sectionedModal';
import {
  EmailAndPasswordSection,
  FileStorageSection,
} from '~/components/accountModalSections';
import AccountIcon from '~/components/icons/AccountIcon';
import StorageIcon from '~/components/icons/StorageIcon';

const sections = {
  emailAndPassword: {
    title: 'Email and password',
    icon: AccountIcon,
    component: EmailAndPasswordSection,
  },
  fileStorage: {
    title: 'File storage',
    icon: StorageIcon,
    component: FileStorageSection,
  },
};

export type AccountModalOpenProps = SectionedModalOpenProps<
  keyof typeof sections
>;
export const useAccountModal = createSectionedModal({
  id: 'account-modal',
  title: 'Account info',
  sections,
  sectionProps: {},
});
