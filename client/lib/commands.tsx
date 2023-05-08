import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from '~/lib/context';
import { IIC, iic } from '~/lib/iic';
import { getSequential } from '~/lib/keyboardShortcuts';
import { projectPath } from '~/lib/routes';
import { KeyboardShortcutConfig } from '~/lib/settingsSchema';
import { Project } from '~/lib/types';
import { useNewDocument } from '~/lib/useNewDocument';

export type BaseCommand = {
  id: string;
  label: string;
  action: IIC;
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

const noopIIC = iic(() => () => {});

// TODO: Change default configs based on platform and browser
const commands: Command[] = [
  {
    id: 'search',
    label: 'Search project',
    search: {
      description: 'Search project',
      icon: <i className="fas fa-search" />,
    },
    keyboardShortcut: {
      hint: 'Search project',
      config: {
        key: 'k',
        metaKey: true,
      },
    },
    action: iic(() => (useContext() as any).toggleSearchModal),
  },
  {
    id: 'new-document',
    label: 'New document',
    search: {
      description: 'Create new document',
      icon: <i className="fas fa-file" />,
    },
    keyboardShortcut: {
      hint: 'Create new document',
      config: {
        key: 'n',
        metaKey: true,
        shiftKey: true,
      },
    },
    action: iic(useNewDocument, { layoutEffect: false }),
  },
  {
    id: 'switch-project',
    label: 'Switch to project 1',
    keyboardShortcut: {
      hint: 'Shortcuts for projects 2-9 are automatically generated',
      sequential: true,
      config: {
        key: '1',
        metaKey: true,
      },
      overrideAction: (event) =>
        iic(
          () => {
            const { projects } = useContext() as {
              projects: Project[];
            };

            const navigate = useNavigate();

            const n = getSequential(event);
            const project = projects.filter((project) => !project.archived_at)[
              n - 1
            ];

            return () => {
              if (project) {
                navigate(projectPath({ projectId: project.id }));
              }
            };
          },
          { layoutEffect: false }
        ),
    },
    action: noopIIC,
  },
  {
    id: 'cycle-focus',
    label: 'Cycle focus',
    keyboardShortcut: {
      hint: 'Cycle focus between the main sections of the interface',
      config: {
        key: 'F6',
        altKey: true,
      },
    },
    action: iic(() => (useContext() as any).cycleFocus),
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
