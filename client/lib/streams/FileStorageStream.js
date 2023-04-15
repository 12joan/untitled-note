import { streamAction } from '~/channels/dataChannel';

const FileStorageStream = {
  quotaUsage(callback) {
    return streamAction('FileStorage', 'quota_usage', {}, callback);
  },

  files(callback) {
    return streamAction('FileStorage', 'files', {}, callback);
  },
};

export default FileStorageStream;
