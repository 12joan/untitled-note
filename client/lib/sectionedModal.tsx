import React, { FC } from 'react';
import { useModal } from '~/lib/useModal';
import { useOverrideable } from '~/lib/useOverrideable';
import { SubscribableRef } from '~/lib/useSubscribableRef';
import { IconProps } from '~/components/icons/makeIcon';
import {
  ModalTitleWithCloseButton,
  StyledModal,
  StyledModalProps,
} from '~/components/Modal';

export type Section<T extends object> = {
  title: string;
  icon: FC<IconProps>;
  component: FC<T>;
};

export interface SectionedModalOpenProps<SectionName extends string> {
  initialSection?: SectionName;
}

export interface CreateSectionedModalOptions<
  SectionName extends string,
  T extends object
> {
  id: string;
  title: string;
  sections: { [K in SectionName]: Section<T> };
  sectionProps: T | SubscribableRef<T>;
}

export const createSectionedModal = <
  SectionName extends string,
  T extends object
>({
  id: sectionedModalId,
  title: sectionedModalTitle,
  sections,
  sectionProps: sectionPropsProp,
}: CreateSectionedModalOptions<SectionName, T>) => {
  const sectionKeys = Object.keys(sections) as SectionName[];

  const idForSectionKey = (key: string) => `${sectionedModalId}-${key}-section`;

  const ModalComponent = ({
    initialSection = sectionKeys[0],
    open,
    onClose,
  }: SectionedModalOpenProps<SectionName> &
    Omit<StyledModalProps, 'children'>) => {
    const [activeSectionKey, setActiveSectionKey] =
      useOverrideable(initialSection);

    const { title: activeSectionTitle, component: ActiveSectionComponent } =
      sections[activeSectionKey];

    const sectionEntries = Object.entries(sections) as [
      SectionName,
      Section<T>
    ][];

    const sectionProps =
      'use' in sectionPropsProp ? sectionPropsProp.use() : sectionPropsProp;

    return (
      <StyledModal
        open={open}
        onClose={onClose}
        customPanelClassNames={{
          width: 'max-w-screen-md w-full',
          height: 'max-sm:min-h-full sm:h-full sm:max-h-[720px]',
          padding: null,
          display: 'flex flex-col',
        }}
      >
        <div className="p-3 pl-5 border-b border-black/10 dark:border-white/10">
          <ModalTitleWithCloseButton
            className={{ heading: 'h3' }}
            onClose={onClose}
          >
            {sectionedModalTitle}
          </ModalTitleWithCloseButton>
        </div>

        <div className="grow flex flex-col sm:flex-row sm:h-0">
          <div className="shrink-0 max-sm:border-b sm:border-r border-black/10 dark:border-white/10 p-2 overflow-y-auto sm:min-w-48">
            <div className="grow space-y-2" role="tablist">
              {sectionEntries.map(([key, { title, icon: Icon }]) => (
                <button
                  key={key}
                  type="button"
                  className="w-full btn btn-rect data-active:btn-primary text-left flex gap-2 items-center"
                  data-active={key === activeSectionKey}
                  onClick={() => setActiveSectionKey(key)}
                  role="tab"
                  aria-selected={key === activeSectionKey}
                  aria-controls={idForSectionKey(key)}
                >
                  <span className="text-primary-500 dark:text-primary-400 data-active:text-white data-active:dark:text-white">
                    <Icon size="1.25em" noAriaLabel />
                  </span>

                  {title}
                </button>
              ))}
            </div>
          </div>

          <div
            className="grow p-5 flex flex-col gap-3 overflow-y-auto children:shrink-0"
            role="tabpanel"
            id={idForSectionKey(activeSectionKey)}
            aria-label={activeSectionTitle}
          >
            <h3 className="h2 select-none">{activeSectionTitle}</h3>

            <ActiveSectionComponent {...sectionProps} />
          </div>
        </div>
      </StyledModal>
    );
  };

  const useSectionedModal = () =>
    useModal<SectionedModalOpenProps<SectionName> | undefined>(
      (modalProps, openProps) => (
        <ModalComponent {...modalProps} {...(openProps || {})} />
      )
    );

  return useSectionedModal;
};
