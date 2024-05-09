import React, { ReactElement } from 'react';
import { useAppContext } from '~/lib/appContext';
import {
  decreaseEditorFontSize,
  increaseEditorFontSize,
  resetEditorFontSize,
} from '~/lib/editorFontSize';
import { envSpecific, FIND_SUPPORTED } from '~/lib/environment';
import { IIC, iic, liftToIIC } from '~/lib/iic';
import { getSequential } from '~/lib/keyboardShortcuts/getSequential';
import { parseKeyboardShortcut } from '~/lib/keyboardShortcuts/parseKeyboardShortcut';
import {
  newDocumentPath,
  overviewPath,
  projectPath,
  recentlyViewedPath,
  tagsPath,
} from '~/lib/routes';
import { KeyboardShortcutConfig } from '~/lib/types';
import { useNavigateOrOpen } from '~/lib/useNavigateOrOpen';
import AccountIcon from '~/components/icons/AccountIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';
import OverviewIcon from '~/components/icons/OverviewIcon';
import RecentIcon from '~/components/icons/RecentIcon';
import SettingsIcon from '~/components/icons/SettingsIcon';
import TagsIcon from '~/components/icons/TagsIcon';

export type BaseCommand = {
  id: string;
  enabled?: boolean;
  label: string;
};

export type BaseActionCommand = BaseCommand & {
  action: (altBehaviour?: boolean) => IIC;
};

export type SearchCommand = BaseActionCommand & {
  search: {
    aliases?: string[];
    description: string;
    icon: ReactElement;
  };
};

export type KeyboardShortcutCommand = BaseCommand & {
  keyboardShortcut: {
    hint: string;
    sequential?: boolean;
    config?: KeyboardShortcutConfig;
    allowConflictOutsideGroup?: string;
    overrideAction?: (event: KeyboardEvent) => IIC;
  };
};

export type Command = SearchCommand | KeyboardShortcutCommand;
export type ActionCommand = Command & BaseActionCommand;
export type ActionKeyboardShortcutCommand = KeyboardShortcutCommand &
  BaseActionCommand;

const noopIIC = liftToIIC(() => {})();

const openInProjectIIC = (
  pathFn: (options: { projectId: number }) => string,
  newTab: boolean
) =>
  iic(
    () => {
      const projectId = useAppContext('projectId');
      const navigateOrOpen = useNavigateOrOpen();

      return () => navigateOrOpen(pathFn({ projectId }), newTab);
    },
    { layoutEffect: false }
  );

// TODO: Change default configs based on platform and browser
const globalCommands: ActionCommand[] = [
  {
    id: 'search',
    label: 'Search project',
    keyboardShortcut: {
      hint: 'Search project',
      config: parseKeyboardShortcut('mod+k'),
    },
    action: () => iic(() => useAppContext('toggleSearchModal')),
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
    id: 'toggle-sidebar',
    label: 'Toggle sidebar',
    keyboardShortcut: {
      hint: 'Show or hide the sidebar',
      config: parseKeyboardShortcut('mod+shift+s'),
    },
    action: () => iic(() => useAppContext('toggleSidebar')),
  },
  {
    id: 'settings',
    label: 'User preferences',
    search: {
      aliases: ['settings'],
      description: 'Open user preferences',
      icon: <SettingsIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Open user preferences',
      config: envSpecific({
        byOS: {
          default: undefined,
          mac: parseKeyboardShortcut('mod+,'),
        },
      }),
    },
    action: () => iic(() => useAppContext('toggleSettingsModal')),
  },
  {
    id: 'account-info',
    label: 'Account info',
    search: {
      aliases: ['email', 'password'],
      description: 'Open account info',
      icon: <AccountIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Open account info',
    },
    action: () => iic(() => useAppContext('toggleAccountModal')),
  },
  {
    id: 'edit-project',
    label: 'Project settings',
    search: {
      description: 'Open project settings',
      icon: <SettingsIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Open project settings',
    },
    action: () => iic(() => useAppContext('toggleProjectSettingsModal')),
  },
  {
    id: 'cycle-focus',
    label: 'Cycle focus',
    keyboardShortcut: {
      hint: 'Cycle focus between the main sections of the interface',
      config: parseKeyboardShortcut('alt+F6'),
    },
    action: () => iic(() => useAppContext('cycleFocus')),
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
            const projects = useAppContext('projects');
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
      aliases: ['home'],
      description: 'Jump to overview',
      icon: <OverviewIcon size="1.25em" noAriaLabel />,
    },
    keyboardShortcut: {
      hint: 'Jump to overview',
    },
    action: (newTab = false) => openInProjectIIC(overviewPath, newTab),
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

const _localKeyboardShortcutCommands = {
  find: {
    id: 'find',
    enabled: FIND_SUPPORTED,
    label: 'Find',
    keyboardShortcut: {
      hint: 'Search for text in the current document',
      config: parseKeyboardShortcut('mod+f'),
    },
  },
  bold: {
    id: 'bold',
    label: 'Bold',
    keyboardShortcut: {
      hint: 'Make text bold',
      config: parseKeyboardShortcut('mod+b'),
      allowConflictOutsideGroup: 'editor',
    },
  },
  italic: {
    id: 'italic',
    label: 'Italic',
    keyboardShortcut: {
      hint: 'Make text italic',
      config: parseKeyboardShortcut('mod+i'),
      allowConflictOutsideGroup: 'editor',
    },
  },
  strikethrough: {
    id: 'strikethrough',
    label: 'Strikethrough',
    keyboardShortcut: {
      hint: 'Strikethrough text',
      config: parseKeyboardShortcut('mod+shift+x'),
      allowConflictOutsideGroup: 'editor',
    },
  },
  code: {
    id: 'code',
    label: 'Inline code',
    keyboardShortcut: {
      hint: 'Make text inline code',
      config: parseKeyboardShortcut('mod+e'),
      allowConflictOutsideGroup: 'editor',
    },
  },
  heading: {
    id: 'heading',
    label: 'Heading',
    keyboardShortcut: {
      hint: 'Convert text to a heading',
      config: parseKeyboardShortcut('mod+alt+1'),
      allowConflictOutsideGroup: 'editor',
    },
  },
  alwaysLink: {
    id: 'alwaysLink',
    label: 'Insert link',
    keyboardShortcut: {
      hint: 'Insert a link',
      config: parseKeyboardShortcut('mod+shift+u'),
      allowConflictOutsideGroup: 'editor',
    },
  },
  linkSelection: {
    id: 'linkSelection',
    label: 'Add link to selection',
    keyboardShortcut: {
      hint: 'Add a link to the selected text',
      config: parseKeyboardShortcut('mod+k'),
      allowConflictOutsideGroup: 'editor',
    },
  },
  blockquote: {
    id: 'blockquote',
    label: 'Blockquote',
    keyboardShortcut: {
      hint: 'Convert text to a blockquote',
      config: parseKeyboardShortcut('mod+shift+.'),
      allowConflictOutsideGroup: 'editor',
    },
  },
  codeBlock: {
    id: 'codeBlock',
    label: 'Code block',
    keyboardShortcut: {
      hint: 'Convert text to a code block',
      allowConflictOutsideGroup: 'editor',
    },
  },
  bulletedList: {
    id: 'bulletedList',
    label: 'Bulleted list',
    keyboardShortcut: {
      hint: 'Convert text to a bulleted list',
      allowConflictOutsideGroup: 'editor',
    },
  },
  numberedList: {
    id: 'numberedList',
    label: 'Numbered list',
    keyboardShortcut: {
      hint: 'Convert text to a numbered list',
      allowConflictOutsideGroup: 'editor',
    },
  },
} satisfies Record<string, KeyboardShortcutCommand>;

export type LocalKeyboardShortcutCommandId =
  keyof typeof _localKeyboardShortcutCommands;

export const localKeyboardShortcutCommands =
  _localKeyboardShortcutCommands as Record<
    LocalKeyboardShortcutCommandId,
    KeyboardShortcutCommand
  >;

export const searchCommands: SearchCommand[] = globalCommands.filter(
  (command): command is SearchCommand => 'search' in command
);

export const globalKeyboardShortcutCommands: ActionKeyboardShortcutCommand[] =
  globalCommands.filter(
    (command): command is ActionKeyboardShortcutCommand =>
      'keyboardShortcut' in command
  );

export const keyboardShortcutCommands: KeyboardShortcutCommand[] = [
  ...globalKeyboardShortcutCommands,
  ...Object.values(localKeyboardShortcutCommands),
];
