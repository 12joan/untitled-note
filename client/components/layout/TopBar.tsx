import React, { ElementType, forwardRef, HTMLAttributes, memo } from 'react';
import { useAppContext } from '~/lib/appContext';
import { NewDocumentLink } from '~/lib/routes';
import { useBreakpoints } from '~/lib/useBreakpoints';
import { Dropdown, DropdownItem, DropdownProps } from '~/components/Dropdown';
import AccountIcon from '~/components/icons/AccountIcon';
import FormattingIcon from '~/components/icons/FormattingIcon';
import LogoutIcon from '~/components/icons/LogoutIcon';
import { IconProps } from '~/components/icons/makeIcon';
import MenuIcon from '~/components/icons/MenuIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';
import OfflineIcon from '~/components/icons/OfflineIcon';
import SearchIcon from '~/components/icons/SearchIcon';
import SettingsIcon from '~/components/icons/SettingsIcon';
import SidebarIcon from '~/components/icons/SidebarIcon';
import { LogoutButton } from '~/components/LogoutButton';
import { Tooltip } from '~/components/Tooltip';

import { useDisconnected } from '~/channels/connectionStatus';

type Action = Record<string, any> & {
  label: string;
  icon: ElementType<IconProps>;
};

export interface TopBar {
  sidebarButton: {
    label: string;
    onClick: () => void;
  };
  formattingButton?: {
    label: string;
    onClick: () => void;
  };
}

export const TopBar = memo(({ sidebarButton, formattingButton }: TopBar) => {
  const project = useAppContext('project');
  const toggleSearchModal = useAppContext('toggleSearchModal');
  const toggleSettingsModal = useAppContext('toggleSettingsModal');
  const toggleAccountModal = useAppContext('toggleAccountModal');

  const { isXs } = useBreakpoints();

  const mainActions: Action[] = [
    { icon: NewDocumentIcon, label: 'New document', as: NewDocumentLink },
    { icon: SearchIcon, label: 'Search', onClick: toggleSearchModal },
    {
      icon: SettingsIcon,
      label: 'User preferences',
      onClick: toggleSettingsModal,
    },
  ];

  const accountActions: Action[] = [
    { icon: AccountIcon, label: 'Account info', onClick: toggleAccountModal },
    { icon: LogoutIcon, label: 'Log out', as: LogoutButton },
  ];

  const isDisconnected = useDisconnected();

  return (
    <>
      <Tooltip content={sidebarButton.label} fixed>
        <NavButton
          icon={SidebarIcon}
          label={sidebarButton.label}
          onClick={sidebarButton.onClick}
        />
      </Tooltip>

      {isDisconnected ? (
        <div
          className="font-medium px-3 py-1 rounded-full bg-red-500 pointer-events-auto select-none flex items-center gap-2 text-white"
          aria-live="assertive"
        >
          <OfflineIcon size="1.25em" noAriaLabel />
          Connection lost
        </div>
      ) : (
        <div className="font-medium px-3 py-1 rounded-full transparent-blur pointer-events-auto truncate grow w-0 max-w-fit">
          {project.name}
        </div>
      )}

      <div className="ml-auto" />

      {formattingButton && (
        <Tooltip content={formattingButton.label} fixed>
          <NavButton
            icon={FormattingIcon}
            label={formattingButton.label}
            onClick={formattingButton.onClick}
            onMouseDown={(event) => event.preventDefault()}
          />
        </Tooltip>
      )}

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
});

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

interface NavButtonProps extends HTMLAttributes<HTMLButtonElement> {
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
        aria-label={label}
        {...otherProps}
      >
        <Icon size="1.25em" noAriaLabel />
      </Component>
    );
  }
);
