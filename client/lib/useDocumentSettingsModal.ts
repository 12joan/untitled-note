import { useMemo } from 'react';
import {
  createSectionedModal,
  SectionedModalOpenProps,
} from '~/lib/sectionedModal';
import { useSubscribableRef } from '~/lib/useSubscribableRef';
import {
  AppearanceSection,
  DocumentSettingsModalSectionProps,
  ExportHTMLSection,
} from '~/components/documentSettingsModalSections';
import AppearanceIcon from '~/components/icons/AppearanceIcon';
import RichTextIcon from '~/components/icons/RichTextIcon';

const sections = {
  appearance: {
    title: 'Appearance',
    icon: AppearanceIcon,
    component: AppearanceSection,
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
