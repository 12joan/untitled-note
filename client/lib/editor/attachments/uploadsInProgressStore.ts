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

export const abortUpload = (id: number) =>
  uploadsInProgress[id]?.abortController.abort();
