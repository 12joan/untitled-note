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

export type AccountModalOpenProps = SectionedModalOpenProps;

export const useAccountModal = createSectionedModal('account-modal', {
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
});
