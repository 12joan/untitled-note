import React, { useEffect, useMemo } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useAppContext } from '~/lib/appContext';
import { forwardParams } from '~/lib/forwardParams';
import { removeProjectFromHistory } from '~/lib/projectHistory';
import { getLastView } from '~/lib/restoreProjectView';
import { Project } from '~/lib/types';
import { AwaitNewDocument } from '~/components/AwaitNewDocument';
import { AwaitRedirect } from '~/components/AwaitRedirect';
import { ProjectView } from '~/components/layout/ProjectView';
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
  const projects = useAppContext('projects');

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
      path: '/await_redirect',
      element: forwardParams(() => (
        <ProjectView
          childView={{ type: 'awaitRedirect', key: 'awaitRedirect', props: {} }}
        />
      )),
    },
    {
      path: '/new_document',
      element: forwardParams(() => <AwaitNewDocument />),
    },
    {
      path: '/tags/:tagId/new_document',
      element: forwardParams(({ tagId }: { tagId: string }) => (
        <AwaitNewDocument tagId={parseInt(tagId, 10)} />
      )),
    },
    {
      path: '/overview',
      element: forwardParams(() => (
        <ProjectView
          childView={{ type: 'overview', key: 'overview', props: {} }}
        />
      )),
    },
    {
      path: '/recently_viewed',
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
      path: '/recently_modified',
      element: forwardParams(() => (
        <ProjectView
          childView={{
            type: 'recentlyModified',
            key: 'recentlyModified',
            props: {},
          }}
        />
      )),
    },
    {
      path: '/tags/:tagId',
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
      path: '/tags',
      element: forwardParams(() => (
        <ProjectView
          childView={{ type: 'allTags', key: 'allTags', props: {} }}
        />
      )),
    },
    {
      path: '/editor/:documentId',
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
      path: '/snapshots/:documentId',
      element: forwardParams(({ documentId }: { documentId: string }) => (
        <ProjectView
          childView={{
            type: 'snapshots',
            key: `snapshots/${documentId}`,
            props: { documentId: parseInt(documentId, 10) },
          }}
        />
      )),
    },
    {
      path: '/',
      element: forwardParams(() => (
        <Navigate to={getLastView(project.id) || 'overview'} replace />
      )),
    },
    {
      path: '/*',
      element: forwardParams(() => (
        <Navigate to={`/projects/${project.id}/overview`} replace />
      )),
    },
  ]);

  return routesComponent;
};
