import React, {
  ComponentType,
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { setLocalStorage, useLocalStorage } from '~/lib/browserStorage';
import { cycleFocus } from '~/lib/cycleFocus';
import { useEditorFontSize } from '~/lib/editorFontSize';
import { projectWasOpened } from '~/lib/projectHistory';
import { mergeRefs } from '~/lib/refUtils';
import { setLastView } from '~/lib/restoreProjectView';
import { useAccountModal } from '~/lib/useAccountModal';
import { useApplicationKeyboardShortcuts } from '~/lib/useApplicationKeyboardShortcuts';
import { useBreakpoints } from '~/lib/useBreakpoints';
import { useElementBounds } from '~/lib/useElementBounds';
import { useElementSize } from '~/lib/useElementSize';
import { useSearchModal } from '~/lib/useSearchModal';
import { useSettingsModal } from '~/lib/useSettingsModal';
import { useViewportSize } from '~/lib/useViewportSize';
import { AwaitRedirect } from '~/components/AwaitRedirect';
import { AllTagsView } from '~/components/layout/AllTagsView';
import { EditorView } from '~/components/layout/EditorView';
import { EditProjectView } from '~/components/layout/EditProjectView';
import { OffcanavasSidebar } from '~/components/layout/OffcanavasSidebar';
import { OverviewView } from '~/components/layout/OverviewView';
import { ProjectsBar } from '~/components/layout/ProjectsBar';
import { RecentlyViewedView } from '~/components/layout/RecentlyViewedView';
import { Sidebar } from '~/components/layout/Sidebar';
import { SnapshotsView } from '~/components/layout/SnapshotsView';
import { TagDocumentsView } from '~/components/layout/TagDocumentsView';
import { TopBar } from '~/components/layout/TopBar';

export interface ProjectViewProps {
  childView: {
    type: string;
    key: string;
    props: any;
  };
}

export const ProjectView = ({ childView }: ProjectViewProps) => {
  const projectId = useAppContext('projectId');
  const { pathname: viewPath } = useLocation();

  useEffect(() => projectWasOpened(projectId), [projectId]);

  const projectsBarRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const sideBarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const formattingToolbarContainerRef = useRef<HTMLDivElement>(null);
  const formattingToolbarRef = useRef<HTMLDivElement>(null);

  const { width: viewportWidth } = useViewportSize();
  const [mainBounds, mainBoundsRef] = useElementBounds();
  const [{ height: topBarHeight }, topBarSizeRef] = useElementSize();

  const staticSidebarPreference = useLocalStorage('staticSidebar', true);
  const toggleStaticSidebar = useCallback(
    () => setLocalStorage<boolean>('staticSidebar', (x) => x === false),
    []
  );

  const { isLg: staticSidebarAvailable } = useBreakpoints();
  const staticSidebar = staticSidebarAvailable && staticSidebarPreference;

  const [offcanvasSidebar, setOffcanvasSidebar] = useState(false);
  const hideOffcanvasSidebar = useCallback(
    () => setOffcanvasSidebar(false),
    []
  );
  const toggleOffcanvasSidebar = useCallback(
    () => setOffcanvasSidebar((x) => !x),
    []
  );

  const toggleSidebar = useCallback(() => {
    if (staticSidebarAvailable) {
      toggleStaticSidebar();
    } else {
      toggleOffcanvasSidebar();
    }
  }, [staticSidebarAvailable, toggleStaticSidebar, toggleOffcanvasSidebar]);

  useEffect(() => {
    if (staticSidebarAvailable) {
      hideOffcanvasSidebar();
    }
  }, [staticSidebarAvailable]);

  const {
    modal: searchModal,
    toggle: toggleSearchModal,
    close: hideSearchModal,
  } = useSearchModal();

  const {
    modal: accountModal,
    toggle: toggleAccountModal,
    close: hideAccountModal,
  } = useAccountModal();

  const {
    modal: settingsModal,
    toggle: toggleSettingsModal,
    close: hideSettingsModal,
  } = useSettingsModal();

  useEffect(() => {
    hideSearchModal();
    hideAccountModal();
    hideSettingsModal();
  }, [childView.key, projectId]);

  const useFormattingToolbar = useCallback(
    (formattingToolbar: ReactNode) =>
      createPortal(
        <aside
          ref={formattingToolbarRef}
          className="pointer-events-auto pr-5 pb-5 pt-1 pl-1 overflow-y-auto flex"
          tabIndex={0}
          aria-label="Formatting toolbar"
          children={formattingToolbar}
        />,
        formattingToolbarContainerRef.current!
      ),
    []
  );

  const ChildView = (
    {
      awaitRedirect: AwaitRedirect,
      overview: OverviewView,
      editProject: EditProjectView,
      recentlyViewed: RecentlyViewedView,
      showTag: TagDocumentsView,
      allTags: AllTagsView,
      editor: EditorView,
      snapshots: SnapshotsView,
    } as Record<string, ComponentType<any>>
  )[childView.type];

  if (!ChildView) {
    throw new Error(`Unknown child view type: ${childView.type}`);
  }

  useEffect(() => {
    if (childView.type !== 'awaitRedirect') {
      setLastView(projectId, viewPath);
    }
  }, [projectId, viewPath]);

  const keyboardShortcutIICElements = useApplicationKeyboardShortcuts();

  const editorFontSize = useEditorFontSize() / 100;
  const narrowWidth = 640 * Math.max(editorFontSize, 1);

  const narrowLeftMargin = useMemo(() => {
    const centerPosition = (viewportWidth - narrowWidth) / 2;
    const centerMargin = Math.max(0, centerPosition - mainBounds.left);
    const maxMargin = Math.max(0, mainBounds.width - narrowWidth);
    return Math.min(centerMargin, maxMargin);
  }, [narrowWidth, viewportWidth, mainBounds.left, mainBounds.width]);

  useEffect(() => {
    const html = document.documentElement;

    /**
     * 1.25rem from main, plus the additional padding from EditorBody, which
     * makes it effectively 1.25em. Add to this the 0.75em from block spacing
     * for a total of 2em.
     */
    const baseScrollPadding = `calc(${2 * editorFontSize}rem`;

    html.style.setProperty(
      'scroll-padding-top',
      `max(${baseScrollPadding}, ${topBarHeight}px)`
    );

    html.style.setProperty('scroll-padding-bottom', baseScrollPadding);
  }, [topBarHeight, editorFontSize]);

  return (
    <AppContextProvider
      useFormattingToolbar={useFormattingToolbar}
      topBarHeight={topBarHeight}
      toggleSearchModal={toggleSearchModal}
      toggleAccountModal={toggleAccountModal}
      toggleSettingsModal={toggleSettingsModal}
      toggleSidebar={toggleSidebar}
      cycleFocus={useCallback(
        () =>
          cycleFocus({
            sectionRefs: [
              mainRef,
              projectsBarRef,
              topBarRef,
              sideBarRef,
              formattingToolbarRef,
            ],
          }),
        []
      )}
    >
      <div className="contents">
        <div
          className="grow flex flex-col"
          style={
            {
              marginTop: mainBounds.top,
              marginLeft: mainBounds.left,
              width: mainBounds.width,
              '--narrow-width': `${narrowWidth}px`,
              '--narrow-margin-left': `${narrowLeftMargin}px`,
              paddingBottom: 'env(safe-area-inset-bottom)',
            } as CSSProperties
          }
        >
          <main
            ref={mainRef}
            className="grow flex flex-col pb-5"
            tabIndex={0}
            aria-label="Main"
          >
            <ChildView
              key={`${projectId}/${childView.key}`}
              {...childView.props}
            />
          </main>
        </div>
      </div>

      <div
        className="fixed inset-0 flex pointer-events-none z-10"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
        }}
      >
        {staticSidebar && (
          <nav
            ref={projectsBarRef}
            className="pointer-events-auto overflow-y-auto border-r bg-plain-50 dark:bg-plain-950/50 dark:border-transparent"
            style={{
              marginLeft: 'calc(-1 * env(safe-area-inset-left))',
              paddingLeft: 'env(safe-area-inset-left)',
            }}
            tabIndex={0}
            aria-label="Projects bar"
            children={<ProjectsBar />}
          />
        )}

        <div className="grow flex flex-col">
          <nav
            ref={mergeRefs([topBarRef, topBarSizeRef])}
            className="p-5 flex items-center gap-2"
            tabIndex={0}
            aria-label="Top bar"
          >
            <TopBar
              sidebarButton={{
                label: staticSidebar ? 'Hide sidebar' : 'Show sidebar',
                onClick: toggleSidebar,
              }}
            />
          </nav>

          <div className="grow flex h-0">
            {staticSidebar && (
              <nav
                ref={sideBarRef}
                className="pointer-events-auto overflow-y-auto p-5 pt-1 pr-1"
                tabIndex={0}
                aria-label="Sidebar"
                children={<Sidebar />}
              />
            )}

            <div ref={mainBoundsRef} className="grow mt-1 mx-5" />

            <div ref={formattingToolbarContainerRef} className="contents" />
          </div>
        </div>
      </div>

      <OffcanavasSidebar
        visible={offcanvasSidebar}
        onClose={hideOffcanvasSidebar}
      />

      {searchModal}
      {accountModal}
      {settingsModal}
      {keyboardShortcutIICElements}
    </AppContextProvider>
  );
};
