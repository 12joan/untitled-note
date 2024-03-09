import { useMemo } from 'react';
import {
  createSectionedModal,
  SectionedModalOpenProps,
} from '~/lib/sectionedModal';
import { useSubscribableRef } from '~/lib/useSubscribableRef';
import {
  AppearanceSection,
  AutomaticSnapshotsSection,
  DocumentSettingsModalSectionProps,
  ExportHTMLSection,
} from '~/components/documentSettingsModalSections';
import AppearanceIcon from '~/components/icons/AppearanceIcon';
import RichTextIcon from '~/components/icons/RichTextIcon';
import VersionHistoryIcon from '~/components/icons/VersionHistoryIcon';

const sections = {
  appearance: {
    title: 'Appearance',
    icon: AppearanceIcon,
    component: AppearanceSection,
  },
  automaticSnapshots: {
    title: 'Automatic snapshots',
    icon: VersionHistoryIcon,
    component: AutomaticSnapshotsSection,
  },
  exportHTML: {
    title: 'Export HTML',
    icon: RichTextIcon,
    component: ExportHTMLSection,
  },
};

export type UseDocumentSettingsModalOptions = DocumentSettingsModalSectionProps;
export type DocumentSettingsModalOpenProps = SectionedModalOpenProps<
  keyof typeof sections
>;

export const useDocumentSettingsModal = (
  options: UseDocumentSettingsModalOptions
) => {
  const optionsRef = useSubscribableRef(options);

  const useModal = useMemo(
    () =>
      createSectionedModal<
        keyof typeof sections,
        DocumentSettingsModalSectionProps
      >('document-settings-modal', sections, optionsRef),
    []
  );

  return useModal();
};
