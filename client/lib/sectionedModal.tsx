import React, { FC, ReactNode } from 'react';
import { useBreakpoints } from '~/lib/useBreakpoints';
import { useModal } from '~/lib/useModal';
import { useOverrideable } from '~/lib/useOverrideable';
import { SubscribableRef } from '~/lib/useSubscribableRef';
import { IconProps } from '~/components/icons/makeIcon';
import { ModalTitle, StyledModal, StyledModalProps } from '~/components/Modal';
import { WithCloseButton } from '~/components/WithCloseButton';

export type Section<T extends object> = {
  title: string;
  icon: FC<IconProps>;
  component: FC<T>;
};

export interface SectionedModalOpenProps<SectionName extends string> {
  initialSection?: SectionName;
}

export const createSectionedModal = <
  SectionName extends string,
  T extends object
>(
  sectionedModalId: string,
  sections: { [key in SectionName]: Section<T> },
  sectionPropsProp: T | SubscribableRef<T>
) => {
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

    const { isSm: horizontalLayout } = useBreakpoints();

    const withCloseButton = (children: ReactNode) => (
      <WithCloseButton
        customClassNames={{
          items: horizontalLayout ? 'items-center' : 'items-start',
        }}
        onClose={onClose}
        children={children}
      />
    );

    const withCloseButtonHorizontal = horizontalLayout
      ? withCloseButton
      : (children: ReactNode) => children;

    const withCloseButtonVertical = horizontalLayout
      ? (children: ReactNode) => children
      : withCloseButton;

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
          margin: 'm-auto sm:mt-[20vh]',
          width: 'max-w-screen-md w-full',
          height: 'max-sm:min-h-full sm:min-h-[500px]',
          padding: null,
          display: 'flex flex-col',
        }}
      >
        <div className="grow flex flex-col sm:flex-row">
          <div className="shrink-0 bg-black/5 max-sm:border-b sm:border-r dark:border-transparent max-sm:rounded-t-2xl sm:rounded-l-2xl p-5 sm:px-2">
            {withCloseButtonVertical(
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
            )}
          </div>

          <div
            className="grow p-5 space-y-3 overflow-y-auto"
            role="tabpanel"
            id={idForSectionKey(activeSectionKey)}
            aria-label={activeSectionTitle}
          >
            {withCloseButtonHorizontal(
              <ModalTitle>{activeSectionTitle}</ModalTitle>
            )}

            <div className="space-y-3">
              <ActiveSectionComponent {...sectionProps} />
            </div>
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
