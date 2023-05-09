import React, {
  AnchorHTMLAttributes,
  ForwardedRef,
  forwardRef,
  Ref,
} from 'react';
import { useContext } from '~/lib/context';
import { getLastView } from '~/lib/restoreProjectView';
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
      const { projectId: currentProject, linkOriginator } = useContext() as {
        projectId: number;
        linkOriginator?: string;
      };

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
    props: AnchorHTMLAttributes<HTMLAnchorElement>,
    ref: Ref<HTMLAnchorElement>
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
