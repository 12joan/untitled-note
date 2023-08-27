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
import { ContextProvider, useContext } from '~/lib/context';
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
  const { projectId } = useContext() as { projectId: number };

  useEffect(() => projectWasOpened(projectId), [projectId]);

  const { pathname: viewPath } = useLocation();

  const projectsBarRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const sideBarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const formattingToolbarContainerRef = useRef<HTMLDivElement>(null);
  const formattingToolbarRef = useRef<HTMLDivElement>(null);

  const { width: viewportWidth } = useViewportSize();
  const [mainBounds, mainBoundsRef] = useElementBounds();
  const [{ height: topBarHeight }, topBarSizeRef] = useElementSize();

  const { isLg } = useBreakpoints();
  const sidebarAlwaysVisible = isLg;

  useEffect(() => {
    const html = document.documentElement;
    const baseScrollPadding = '1.25rem';
    html.style.setProperty(
      'scroll-padding-top',
      `max(${baseScrollPadding}, ${topBarHeight}px)`
    );
    html.style.setProperty('scroll-padding-bottom', baseScrollPadding);
  }, [topBarHeight]);

  const [offcanvasSidebarVisible, setOffcanvasSidebarVisible] = useState(false);

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

  useEffect(() => {
    if (sidebarAlwaysVisible) {
      setOffcanvasSidebarVisible(false);
    }
  }, [sidebarAlwaysVisible]);

  const ChildView = (
    {
      awaitRedirect: AwaitRedirect,
      overview: OverviewView,
      editProject: EditProjectView,
      recentlyViewed: RecentlyViewedView,
      showTag: TagDocumentsView,
      allTags: AllTagsView,
      editor: EditorView,
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

  const editorFontSize = useEditorFontSize();
  const narrowWidth = 640 * Math.max(editorFontSize / 100, 1);

  const narrowLeftMargin = useMemo(() => {
    const centerPosition = (viewportWidth - narrowWidth) / 2;
    const centerMargin = Math.max(0, centerPosition - mainBounds.left);
    const maxMargin = Math.max(0, mainBounds.width - narrowWidth);
    return Math.min(centerMargin, maxMargin);
  }, [narrowWidth, viewportWidth, mainBounds.left, mainBounds.width]);

  return (
    <ContextProvider
      useFormattingToolbar={useFormattingToolbar}
      topBarHeight={topBarHeight}
      toggleSearchModal={toggleSearchModal}
      toggleAccountModal={toggleAccountModal}
      toggleSettingsModal={toggleSettingsModal}
      cycleFocus={() =>
        cycleFocus({
          sectionRefs: [
            mainRef,
            projectsBarRef,
            topBarRef,
            sideBarRef,
            formattingToolbarRef,
          ],
        })
      }
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
        {sidebarAlwaysVisible && (
          <nav
            ref={projectsBarRef}
            className="pointer-events-auto overflow-y-auto border-r bg-slate-50 dark:bg-black/25 dark:border-transparent"
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
              showSidebarButton={!sidebarAlwaysVisible}
              onSidebarButtonClick={() => setOffcanvasSidebarVisible(true)}
            />
          </nav>

          <div className="grow flex h-0">
            {sidebarAlwaysVisible && (
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
        visible={offcanvasSidebarVisible}
        onClose={() => setOffcanvasSidebarVisible(false)}
      />

      {searchModal}
      {accountModal}
      {settingsModal}
      {keyboardShortcutIICElements}
    </ContextProvider>
  );
};
