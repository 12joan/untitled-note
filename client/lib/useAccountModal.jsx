import React, { useState } from 'react'

import useModal from '~/lib/useModal'
import useBreakpoints from '~/lib/useBreakpoints'

import * as SectionComponents from '~/components/accountModalSections'
import { ModalTitle } from '~/components/Modal'
import WithCloseButton from '~/components/WithCloseButton'
import AccountIcon from '~/components/icons/AccountIcon'
import StorageIcon from '~/components/icons/StorageIcon'

const sections = {
  emailAndPassword: { title: 'Email and password', icon: AccountIcon, component: SectionComponents.EmailAndPassword },
  fileStorage: { title: 'File storage', icon: StorageIcon, component: SectionComponents.FileStorage },
}

const sectionKeys = Object.keys(sections)

const idForSectionKey = key => `account-modal-${key}-section`

const useAccountModal = () => useModal(AccountModal, {
  customPanelClassNames: {
    margin: 'm-auto sm:mt-[20vh]',
    width: 'max-w-screen-md w-full',
    height: 'max-sm:min-h-full sm:min-h-[500px]',
    padding: null,
    display: 'flex flex-col',
  },
})

const AccountModal = ({ initialSection = sectionKeys[0], onClose }) => {
  const [activeSectionKey, setActiveSectionKey] = useState(initialSection)

  const {
    title: activeSectionTitle,
    component: ActiveSectionComponent,
  } = sections[activeSectionKey]

  const { isSm: horizontalLayout } = useBreakpoints()

  const withCloseButton = children => (
    <WithCloseButton
      customClassNames={{ items: horizontalLayout ? 'items-center' : 'items-start' }}
      onClose={onClose}
      children={children}
    />
  )

  return (
    <div className="grow flex flex-col sm:flex-row">
      <div className="shrink-0 bg-black/5 max-sm:border-b sm:border-r dark:border-transparent max-sm:rounded-t-2xl sm:rounded-l-2xl p-5 sm:px-2">
        {(horizontalLayout ? x => x : withCloseButton)(
          <div className="grow space-y-2" role="tablist">
            {Object.entries(sections).map(([key, { title, icon: Icon }]) => (
              <button
                key={key}
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
        {(horizontalLayout ? withCloseButton : x => x)(
          <ModalTitle>{activeSectionTitle}</ModalTitle>
        )}

        <div className="space-y-3">
          <ActiveSectionComponent />
        </div>
      </div>
    </div>
  )
}

export default useAccountModal
