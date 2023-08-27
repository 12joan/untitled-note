import React, { ReactElement } from 'react';
import { useContext } from '~/lib/context';
import { envSpecific } from '~/lib/environment';
import { IIC, iic, liftToIIC } from '~/lib/iic';
import { getSequential } from '~/lib/keyboardShortcuts/getSequential';
import { parseKeyboardShortcut } from '~/lib/keyboardShortcuts/parseKeyboardShortcut';
import {
  editProjectPath,
  newDocumentPath,
  overviewPath,
  projectPath,
  recentlyViewedPath,
  tagsPath,
} from '~/lib/routes';
import { KeyboardShortcutConfig } from '~/lib/settingsSchema';
import { Project } from '~/lib/types';
import AccountIcon from '~/components/icons/AccountIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';
import OverviewIcon from '~/components/icons/OverviewIcon';
import RecentIcon from '~/components/icons/RecentIcon';
import SettingsIcon from '~/components/icons/SettingsIcon';
import TagsIcon from '~/components/icons/TagsIcon';
import {
  decreaseEditorFontSize,
  increaseEditorFontSize,
  resetEditorFontSize,
} from './editorFontSize';
import { useNavigateOrOpen } from './useNavigateOrOpen';

export type BaseCommand = {
  id: string;
  label: string;
  action: (altBehaviour?: boolean) => IIC;
};

export type SearchCommand = BaseCommand & {
  search: {
    description: string;
    icon: ReactElement;
  };
};

export type KeyboardShortcutCommand = BaseCommand & {
  keyboardShortcut: {
    hint: string;
    sequential?: boolean;
    config?: KeyboardShortcutConfig;
    overrideAction?: (event: KeyboardEvent) => IIC;
  };
};

export type Command = SearchCommand | KeyboardShortcutCommand;

const noopIIC = liftToIIC(() => {})();

const openInProjectIIC = (
  pathFn: (options: { projectId: number }) => string,
  newTab: boolean
) =>
  iic(
    () => {
      const { projectId } = useContext() as {
        projectId: number;
      };

      const navigateOrOpen = useNavigateOrOpen();

      return () => navigateOrOpen(pathFn({ projectId }), newTab);
    },
    { layoutEffect: false }
  );

// TODO: Change default configs based on platform and browser
const commands: Command[] = [
  {
    id: 'search',
    label: 'Search project',
    keyboardShortcut: {
      hint: 'Search project',
      config: parseKeyboardShortcut('mod+k'),
    },
    action: () => iic(() => (useContext() as any).toggleSearchModal),
  },
  {
    id: 'new-document',
    label: 'New document',
    search: {
      description: 'Create new document',
      icon: <NewDocumentIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Create new document',
      config: parseKeyboardShortcut('mod+alt+n', {
        customComparison: {
          property: 'keyCode',
          value: 78,
        },
      }),
    },
    action: (newTab = false) => openInProjectIIC(newDocumentPath, newTab),
  },
  {
    id: 'decrease-font-size',
    label: 'Decrease font size',
    keyboardShortcut: {
      hint: 'Decrease document font size',
      config: parseKeyboardShortcut('mod+shift+-'),
    },
    action: liftToIIC(decreaseEditorFontSize),
  },
  {
    id: 'increase-font-size',
    label: 'Increase font size',
    keyboardShortcut: {
      hint: 'Increase document font size',
      config: parseKeyboardShortcut('mod+shift+='),
    },
    action: liftToIIC(increaseEditorFontSize),
  },
  {
    id: 'reset-font-size',
    label: 'Reset font size',
    keyboardShortcut: {
      hint: 'Reset document font size',
      config: parseKeyboardShortcut('mod+shift+0'),
    },
    action: liftToIIC(resetEditorFontSize),
  },
  {
    id: 'settings',
    label: 'Settings',
    search: {
      description: 'Open settings',
      icon: <SettingsIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Open settings',
      config: envSpecific({
        byOS: {
          default: undefined,
          mac: parseKeyboardShortcut('mod+,'),
        },
      }),
    },
    action: () => iic(() => (useContext() as any).toggleSettingsModal),
  },
  {
    id: 'account-info',
    label: 'Account info',
    search: {
      description: 'Open account info',
      icon: <AccountIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Open account info',
    },
    action: () => iic(() => (useContext() as any).toggleAccountModal),
  },
  {
    id: 'cycle-focus',
    label: 'Cycle focus',
    keyboardShortcut: {
      hint: 'Cycle focus between the main sections of the interface',
      config: parseKeyboardShortcut('alt+F6'),
    },
    action: () => iic(() => (useContext() as any).cycleFocus),
  },
  {
    id: 'switch-project',
    label: 'Switch to project 1',
    keyboardShortcut: {
      hint: 'Shortcuts for projects 2-9 are automatically generated',
      sequential: true,
      config: parseKeyboardShortcut(
        envSpecific({
          byBrowser: {
            default: 'mod+1',
            safari: 'mod+shift+1',
          },
        })
      ),
      overrideAction: (event) =>
        iic(
          () => {
            const { projects } = useContext() as {
              projects: Project[];
            };

            const navigateOrOpen = useNavigateOrOpen();

            const n = getSequential(event);
            const project = projects.filter((project) => !project.archived_at)[
              n - 1
            ];

            return () => {
              if (project) {
                navigateOrOpen(projectPath({ projectId: project.id }));
              }
            };
          },
          { layoutEffect: false }
        ),
    },
    action: () => noopIIC,
  },
  {
    id: 'overview',
    label: 'Overview',
    search: {
      description: 'Jump to overview',
      icon: <OverviewIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Jump to overview',
    },
    action: (newTab = false) => openInProjectIIC(overviewPath, newTab),
  },
  {
    id: 'edit-project',
    label: 'Edit project',
    search: {
      description: 'Jump to edit project',
      icon: <SettingsIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Jump to edit project',
    },
    action: (newTab = false) => openInProjectIIC(editProjectPath, newTab),
  },
  {
    id: 'recently-viewed',
    label: 'Recently viewed',
    search: {
      description: 'Jump to recently viewed',
      icon: <RecentIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Jump to recently viewed',
    },
    action: (newTab = false) => openInProjectIIC(recentlyViewedPath, newTab),
  },
  {
    id: 'all-tags',
    label: 'All tags',
    search: {
      description: 'Jump to all tags',
      icon: <TagsIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Jump to all tags',
    },
    action: (newTab = false) => openInProjectIIC(tagsPath, newTab),
  },
];

export const searchCommands: SearchCommand[] = commands.filter(
  (command): command is SearchCommand => 'search' in command
);

export const keyboardShortcutCommands: KeyboardShortcutCommand[] =
  commands.filter(
    (command): command is KeyboardShortcutCommand =>
      'keyboardShortcut' in command
  );
