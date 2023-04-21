import React, { ForwardedRef, forwardRef, useEffect, useMemo } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useContext } from '~/lib/context';
import { forwardParams } from '~/lib/forwardParams';
import { removeProjectFromHistory } from '~/lib/projectHistory';
import { getLastView } from '~/lib/restoreProjectView';
import { Project } from '~/lib/types';
import { AwaitRedirect } from '~/components/AwaitRedirect';
import { ProjectView } from '~/components/layout/ProjectView';
import { Link, LinkProps } from '~/components/Link';
import { RestoreLastOpenProject } from '~/components/RestoreLastOpenProject';
import { StreamProjectData } from '~/components/StreamProjectData';

/**
 * To keep the component tree consistent, we need to use forwardParams on all
 * routes, even if they don't have any params. Otherwise, React will remount
 * the ProjectView component when the view or project changes.
 */

export const ApplicationRoutes = () => {
  const routesComponent = useRoutes([
    {
      path: '/await_redirect',
      element: forwardParams(() => <AwaitRedirect />),
    },
    {
      path: '/projects/:projectId/*',
      element: forwardParams(
        ({ projectId: rawProjectId }: { projectId: string }) => {
          const projectId = parseInt(rawProjectId, 10);

          return (
            <WithProject projectId={projectId}>
              {(project) => (
                <StreamProjectData project={project}>
                  <ProjectRoutes project={project} />
                </StreamProjectData>
              )}
            </WithProject>
          );
        }
      ),
    },
    {
      path: '*',
      element: forwardParams(() => <RestoreLastOpenProject />),
    },
  ]);

  return routesComponent;
};

interface WithProject {
  projectId: number;
  children: (project: Project) => JSX.Element;
}

const WithProject = ({ projectId, children }: WithProject): JSX.Element => {
  const { projects } = useContext() as {
    projects: Project[];
  };

  const project = useMemo(
    () => projects.find((project) => project.id === projectId),
    [projects, projectId]
  );

  return project ? (
    children(project)
  ) : (
    <ProjectDoesNotExist projectId={projectId} />
  );
};

const ProjectDoesNotExist = ({ projectId }: { projectId: number }) => {
  useEffect(() => {
    removeProjectFromHistory(projectId);
  }, [projectId]);

  return <Navigate to="/" replace />;
};

interface ProjectRoutesProps {
  project: Project;
}

const ProjectRoutes = ({ project }: ProjectRoutesProps) => {
  const routesComponent = useRoutes([
    {
      path: 'await_redirect',
      element: forwardParams(() => (
        <ProjectView
          childView={{ type: 'awaitRedirect', key: 'awaitRedirect', props: {} }}
        />
      )),
    },
    {
      path: 'overview',
      element: forwardParams(() => (
        <ProjectView
          childView={{ type: 'overview', key: 'overview', props: {} }}
        />
      )),
    },
    {
      path: 'edit',
      element: forwardParams(() => (
        <ProjectView
          childView={{ type: 'editProject', key: 'editProject', props: {} }}
        />
      )),
    },
    {
      path: 'recently_viewed',
      element: forwardParams(() => (
        <ProjectView
          childView={{
            type: 'recentlyViewed',
            key: 'recentlyViewed',
            props: {},
          }}
        />
      )),
    },
    {
      path: 'tags/:tagId',
      element: forwardParams(({ tagId }: { tagId: string }) => (
        <ProjectView
          childView={{
            type: 'showTag',
            key: `tags/${tagId}`,
            props: { tagId: parseInt(tagId, 10) },
          }}
        />
      )),
    },
    {
      path: 'tags',
      element: forwardParams(() => (
        <ProjectView
          childView={{ type: 'allTags', key: 'allTags', props: {} }}
        />
      )),
    },
    {
      path: 'editor/:documentId',
      element: forwardParams(({ documentId }: { documentId: string }) => (
        <ProjectView
          childView={{
            type: 'editor',
            key: `editor/${documentId}`,
            props: { documentId: parseInt(documentId, 10) },
          }}
        />
      )),
    },
    {
      path: '*',
      element: forwardParams(() => (
        <Navigate to={`/projects/${project.id}/overview`} replace />
      )),
    },
  ]);

  return routesComponent;
};

export interface RouteLinkProps<T> extends Omit<LinkProps, 'to'> {
  to: Omit<T, 'projectId'> & {
    projectId?: number;
  };
}

const createLinkComponent = <
  T extends Record<string, any> & { projectId: number }
>(
  getPath: (options: T) => string
) =>
  forwardRef(
    (
      { to, ...otherProps }: RouteLinkProps<T>,
      ref: ForwardedRef<HTMLAnchorElement>
    ) => {
      const { projectId: currentProject, linkOriginator } = useContext() as {
        projectId: number;
        linkOriginator?: string;
      };

      const path = getPath({
        ...to,
        projectId: to.projectId ?? currentProject,
      } as T);

      return (
        <Link ref={ref} to={path} state={{ linkOriginator }} {...otherProps} />
      );
    }
  );

type ProjectRoute = {
  projectId: number;
};

type ProjectDocumentRoute = ProjectRoute & {
  documentId: number;
};

type ProjectTagRoute = ProjectRoute & {
  tagId: number;
};

export const logoutPath = '/auth/logout';
export const awaitRedirectPath = ({ projectId }: Partial<ProjectRoute>) =>
  projectId ? `/projects/${projectId}/await_redirect` : '/await_redirect';
export const overviewPath = ({ projectId }: ProjectRoute) =>
  `/projects/${projectId}/overview`;
export const projectPath = ({ projectId }: ProjectRoute) =>
  getLastView(projectId) ?? overviewPath({ projectId });
export const editProjectPath = ({ projectId }: ProjectRoute) =>
  `/projects/${projectId}/edit`;
export const recentlyViewedPath = ({ projectId }: ProjectRoute) =>
  `/projects/${projectId}/recently_viewed`;
export const tagPath = ({ projectId, tagId }: ProjectTagRoute) =>
  `/projects/${projectId}/tags/${tagId}`;
export const tagsPath = ({ projectId }: ProjectRoute) =>
  `/projects/${projectId}/tags`;
export const documentPath = ({ projectId, documentId }: ProjectDocumentRoute) =>
  `/projects/${projectId}/editor/${documentId}`;
export const recentlyViewedDocumentPath = (args: ProjectDocumentRoute) =>
  `${documentPath(args)}?recently_viewed`;

export const LogoutLink = forwardRef(
  (
    props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    return <a ref={ref} href={logoutPath} {...props} />;
  }
);

export const OverviewLink = createLinkComponent(overviewPath);
export const ProjectLink = createLinkComponent(projectPath);
export const EditProjectLink = createLinkComponent(editProjectPath);
export const RecentlyViewedLink = createLinkComponent(recentlyViewedPath);
export const TagLink = createLinkComponent(tagPath);
export const TagsLink = createLinkComponent(tagsPath);
export const DocumentLink = createLinkComponent(documentPath);
export const RecentlyViewedDocumentLink = createLinkComponent(
  recentlyViewedDocumentPath
);
