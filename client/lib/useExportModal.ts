import {
  createSectionedModal,
  SectionedModalOpenProps,
} from '~/lib/sectionedModal';
import {
  ExportHTMLSection,
  ExportModalSectionProps,
} from '~/components/exportModalSections';
import RichTextIcon from '~/components/icons/RichTextIcon';

export type UseExportModalOptions = ExportModalSectionProps;
export type ExportModalOpenProps = SectionedModalOpenProps;

export const useExportModal = (options: UseExportModalOptions) => {
  const useModal = createSectionedModal<ExportModalSectionProps>(
    'export-modal',
    {
      html: {
        title: 'Export HTML',
        icon: RichTextIcon,
        component: ExportHTMLSection,
      },
    },
    options
  );

  return useModal();
};
