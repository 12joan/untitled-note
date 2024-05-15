import { Project } from '~/lib/types';

export const setProjectArchivedAt = (
  archivedAt: Project['archived_at'],
  isArchived: boolean
) => {
  if (!isArchived) return null;
  const isAlreadyArchived = !!archivedAt;
  return isAlreadyArchived ? archivedAt : new Date().toISOString();
};
