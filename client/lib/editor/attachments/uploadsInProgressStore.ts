export type UploadState = {
  abortController: AbortController;
};

const uploadsInProgress: Record<number, UploadState> = {};

export const registerUpload = (id: number, data: UploadState) => {
  uploadsInProgress[id] = data;
};

export const deregisterUpload = (id: number) => {
  delete uploadsInProgress[id];
};

export const getUploadIsInProgress = (id: number) =>
  Boolean(uploadsInProgress[id]);

export const forEachUpload = (
  callback: ([id, data]: [number, UploadState]) => void
) => {
  Object.entries(uploadsInProgress).forEach(([id, data]) =>
    callback([parseInt(id, 10), data])
  );
};
