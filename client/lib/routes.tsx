import React, { ForwardedRef, forwardRef } from 'react';
import { useAppContext } from '~/lib/appContext';
import { newDocumentToken } from '~/components/AwaitNewDocument';
import { Link, LinkProps } from '~/components/Link';

type HasRequiredKeys<T> = Exclude<
  keyof T,
  {
    [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never;
  }[keyof T]
> extends never
  ? false
  : true;

const createLinkComponent = <
  T extends Record<string, any> & { projectId?: number }
>(
  getPath: (options: T) => string
) => {
  type WithOptionalProjectId = Omit<T, 'projectId'> & { projectId?: number };

  type ToProp = HasRequiredKeys<WithOptionalProjectId> extends true
    ? { to: WithOptionalProjectId }
    : { to?: WithOptionalProjectId };

  type RouteLinkProps = Omit<LinkProps, 'to'> & ToProp;

  return forwardRef(
    (
      { to, ...otherProps }: RouteLinkProps,
      ref: ForwardedRef<HTMLAnchorElement>
    ) => {
      const currentProject = useAppContext('projectId');
      const linkOriginator = useAppContext('linkOriginator');

      const path = getPath({
        ...to,
        projectId: to?.projectId ?? currentProject,
      } as T);

      return (
        <Link ref={ref} to={path} state={{ linkOriginator }} {...otherProps} />
      );
    }
  );
};

type ProjectRoute = {
  projectId: number;
};

type ProjectDocumentRoute = ProjectRoute & {
  documentId: number;
};

type ProjectTagRoute = ProjectRoute & {
  tagId: number;
};

type ProjectOptionalTagRoute = ProjectRoute & {
  tagId?: number;
};

export const awaitRedirectPath = ({ projectId }: Partial<ProjectRoute>) =>
  projectId ? `/projects/${projectId}/await_redirect` : '/await_redirect';

export const projectPath = ({ projectId }: ProjectRoute) =>
  `/projects/${projectId}`;

export const overviewPath = ({ projectId }: ProjectRoute) =>
  `/projects/${projectId}/overview`;

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

export const newDocumentPath = ({
  projectId,
  tagId,
}: ProjectOptionalTagRoute) =>
  `/projects/${projectId}${
    tagId ? `/tags/${tagId}` : ''
  }/new_document#${newDocumentToken}`;

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
export const NewDocumentLink = createLinkComponent(newDocumentPath);
