import { MutableRefObject, ReactNode } from 'react';
import { createContext, ProviderProps } from '~/lib/context';
import { Future } from '~/lib/monads';
import { SettingsSchema } from '~/lib/settingsSchema';
import {
  EditorStyle,
  PartialDocument,
  Project,
  S3File,
  StorageQuotaUsage,
  Tag,
} from '~/lib/types';
import { AccountModalOpenProps } from '~/lib/useAccountModal';

export type AppContext = {
  settings: SettingsSchema;
  setSettings: (settings: SettingsSchema) => void;
  futureQuotaUsage: Future<StorageQuotaUsage>;
  futureRemainingQuota: Future<number>;
  futureFiles: Future<S3File[]>;
  projectId: number;
  documentId: number;
  invalidateProjectsCache: () => void;
  projects: Project[];
  project: Project;
  futureTags: Future<Tag[]>;
  futurePartialDocuments: Future<PartialDocument[]>;
  futurePinnedDocuments: Future<PartialDocument[]>;
  futureRecentlyViewedDocuments: Future<PartialDocument[]>;
  useFormattingToolbar: (children: ReactNode) => JSX.Element;
  topBarHeight: number;
  toggleSearchModal: () => void;
  toggleAccountModal: (...args: [] | [AccountModalOpenProps]) => void;
  toggleSettingsModal: () => void;
  toggleSidebar: () => void;
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
    futureTags: null,
    futurePartialDocuments: null,
    futurePinnedDocuments: null,
    futureRecentlyViewedDocuments: null,
    useFormattingToolbar: null,
    toggleSearchModal: null,
    toggleAccountModal: null,
    toggleSettingsModal: null,
    toggleSidebar: null,
    cycleFocus: null,
    onButtonClick: null,
    closeDropdown: null,
    mentionSuggestionsContainerRef: null,
    editorStyle: null,
  });

export type AppContextProviderProps = ProviderProps<AppContext>;
