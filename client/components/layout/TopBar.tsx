import React, { ElementType, forwardRef } from 'react';
import { useContext } from '~/lib/context';
import { LogoutLink } from '~/lib/routes';
import { Project } from '~/lib/types';
import { useBreakpoints } from '~/lib/useBreakpoints';
import { useNewDocument } from '~/lib/useNewDocument';
import { Dropdown, DropdownItem, DropdownProps } from '~/components/Dropdown';
import AccountIcon from '~/components/icons/AccountIcon';
import LogoutIcon from '~/components/icons/LogoutIcon';
import { IconProps } from '~/components/icons/makeIcon';
import MenuIcon from '~/components/icons/MenuIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';
import OfflineIcon from '~/components/icons/OfflineIcon';
import SearchIcon from '~/components/icons/SearchIcon';
import SettingsIcon from '~/components/icons/SettingsIcon';
import SidebarIcon from '~/components/icons/SidebarIcon';
import { Tooltip } from '~/components/Tooltip';

import { useDisconnected } from '~/channels/connectionStatus';

type Action = Record<string, any> & {
  label: string;
  icon: ElementType<IconProps>;
};

export interface TopBar {
  showSidebarButton?: boolean;
  onSidebarButtonClick?: () => void;
}

export const TopBar = ({
  showSidebarButton = false,
  onSidebarButtonClick,
}: TopBar) => {
  const { project, showSearchModal, showAccountModal, showSettingsModal } =
    useContext() as {
      project: Project;
      showSearchModal: () => void;
      showAccountModal: () => void;
      showSettingsModal: () => void;
    };

  const { isXs } = useBreakpoints();

  const createNewDocument = useNewDocument();

  const mainActions: Action[] = [
    {
      icon: NewDocumentIcon,
      label: 'New document',
      onClick: createNewDocument,
    },
    { icon: SearchIcon, label: 'Search', onClick: showSearchModal },
    { icon: SettingsIcon, label: 'Settings', onClick: showSettingsModal },
  ];

  const accountActions: Action[] = [
    { icon: AccountIcon, label: 'Account info', onClick: showAccountModal },
    { icon: LogoutIcon, label: 'Log out', as: LogoutLink },
  ];

  const isDisconnected = useDisconnected();

  return (
    <>
      {showSidebarButton && (
        <Tooltip content="Show sidebar" fixed>
          <NavButton
            icon={SidebarIcon}
            label="Show sidebar"
            onClick={onSidebarButtonClick}
          />
        </Tooltip>
      )}

      {isDisconnected ? (
        <div
          className="font-medium px-3 py-1 rounded-full bg-red-500 pointer-events-auto select-none flex items-center gap-2 text-white"
          aria-live="assertive"
        >
          <OfflineIcon size="1.25em" noAriaLabel />
          Connection lost
        </div>
      ) : (
        <div
          className={`font-medium ${
            showSidebarButton ? '' : '-ml-3'
          } px-3 py-1 rounded-full transparent-blur pointer-events-auto truncate`}
        >
          {project.name}
        </div>
      )}

      <div className="grow" />

      {isXs ? (
        <>
          {mainActions.map(({ label, ...otherProps }) => (
            <Tooltip key={label} content={label} fixed>
              <NavButton label={label} {...otherProps} />
            </Tooltip>
          ))}

          <NavDropdown
            icon={AccountIcon}
            label="Account"
            actions={accountActions}
            trigger="mouseenter click"
            interactiveBorder={10}
          />
        </>
      ) : (
        <NavDropdown
          icon={MenuIcon}
          label="Menu"
          actions={[...mainActions, ...accountActions]}
        />
      )}
    </>
  );
};

interface NavDropdownProps extends Omit<DropdownProps, 'items'> {
  icon: ElementType<IconProps>;
  label: string;
  actions: Action[];
}

const NavDropdown = ({
  icon,
  label,
  actions,
  ...otherProps
}: NavDropdownProps) => {
  return (
    <Dropdown
      items={actions.map(({ label, ...otherProps }) => (
        <DropdownItem key={label} children={label} {...otherProps} />
      ))}
      placement="bottom-end"
      className="pointer-events-auto"
      {...otherProps}
    >
      <NavButton icon={icon} label={label} />
    </Dropdown>
  );
};

interface NavButtonProps extends Record<string, any> {
  as?: ElementType;
  label: string;
  icon: ElementType;
}

const NavButton = forwardRef(
  (
    {
      as: Component = 'button',
      label,
      icon: Icon,
      ...otherProps
    }: NavButtonProps,
    ref
  ) => {
    const buttonProps = Component === 'button' ? { type: 'button' } : {};

    return (
      <Component
        ref={ref}
        {...buttonProps}
        className="shrink-0 block btn btn-no-rounded transparent-blur rounded-full p-2 aspect-square pointer-events-auto"
        {...otherProps}
      >
        <Icon size="1.25em" ariaLabel={label} />
      </Component>
    );
  }
);
