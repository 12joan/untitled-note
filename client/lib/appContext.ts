import { MutableRefObject } from 'react';
import { createContext, ProviderProps } from '~/lib/context';
import { Future } from '~/lib/monads';
import {
  EditorStyle,
  PartialDocument,
  Project,
  ProjectFolder,
  S3File,
  Settings,
  StorageQuotaUsage,
  Tag,
} from '~/lib/types';
import { FilesModalOpenProps } from '~/lib/useFilesModal';
import { ProjectSettingsModalOpenProps } from '~/lib/useProjectSettingsModal';
import { SearchModalOpenProps } from '~/lib/useSearchModal';
import { SettingsModalOpenProps } from '~/lib/useSettingsModal';

export type AppContext = {
  settings: Settings;
  setSettings: (delta: Partial<Settings>) => void;
  futureQuotaUsage: Future<StorageQuotaUsage>;
  futureRemainingQuota: Future<number>;
  futureFiles: Future<S3File[]>;
  projectId: number;
  documentId: number;
  invalidateProjectsCache: () => void;
  projects: Project[];
  project: Project;
  futureProjectFolders: Future<ProjectFolder[]>;
  futureTags: Future<Tag[]>;
  futurePartialDocuments: Future<PartialDocument[]>;
  futurePinnedDocuments: Future<PartialDocument[]>;
  futureRecentlyViewedDocuments: Future<PartialDocument[]>;
  futureRecentlyModifiedDocuments: Future<PartialDocument[]>;
  futureRecentlyViewedDocumentsExcludingPinned: Future<PartialDocument[]>;
  futureRecentlyModifiedDocumentsExcludingPinned: Future<PartialDocument[]>;
  topBarHeight: number;
  toggleSearchModal: (...args: [] | [SearchModalOpenProps]) => void;
  toggleFilesModal: (...args: [] | [FilesModalOpenProps]) => void;
  toggleSettingsModal: (...args: [] | [SettingsModalOpenProps]) => void;
  toggleProjectSettingsModal: (
    ...args: [] | [ProjectSettingsModalOpenProps]
  ) => void;
  toggleSidebar: () => void;
  toggleFormattingToolbar: () => void;
  cycleFocus: () => void;
  linkOriginator?: string;
  inModal?: boolean;
  onButtonClick: () => void;
  closeDropdown: () => void;
  mentionSuggestionsContainerRef: MutableRefObject<HTMLDivElement | null>;
  editorStyle: EditorStyle;
};

export const { Provider: AppContextProvider, useContext: useAppContext } =
  createContext<AppContext>({
    topBarHeight: { data: 0 },
    linkOriginator: { data: undefined },
    inModal: { data: false },
    settings: null,
    setSettings: null,
    futureQuotaUsage: null,
    futureRemainingQuota: null,
    futureFiles: null,
    projectId: null,
    documentId: null,
    invalidateProjectsCache: null,
    projects: null,
    project: null,
    futureProjectFolders: null,
    futureTags: null,
    futurePartialDocuments: null,
    futurePinnedDocuments: null,
    futureRecentlyViewedDocuments: null,
    futureRecentlyModifiedDocuments: null,
    futureRecentlyViewedDocumentsExcludingPinned: null,
    futureRecentlyModifiedDocumentsExcludingPinned: null,
    toggleSearchModal: null,
    toggleFilesModal: null,
    toggleSettingsModal: null,
    toggleProjectSettingsModal: null,
    toggleSidebar: null,
    toggleFormattingToolbar: null,
    cycleFocus: null,
    onButtonClick: null,
    closeDropdown: null,
    mentionSuggestionsContainerRef: null,
    editorStyle: null,
  });

export type AppContextProviderProps = ProviderProps<AppContext>;
