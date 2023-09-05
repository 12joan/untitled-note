const generic: Record<string, string> = {
  image: 'Image',
  audio: 'Audio',
  video: 'Video',
  text: 'Text file',
  font: 'Font file',
};

const specific: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'Word document',
  'application/vnd.ms-excel': 'Excel spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    'Excel spreadsheet',
  'application/vnd.ms-powerpoint': 'Powerpoint presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'Powerpoint presentation',
  'application/rtf': 'RTF document',
  'application/zip': 'Zip file',
  'application/x-rar-compressed': 'Rar file',
  'application/x-7z-compressed': '7z file',
  'application/x-tar': 'Tar file',
  'application/gzip': 'Gzip file',
  'application/json': 'JSON file',
};

export const friendlyMime = (mime: string) => {
  const firstPart = mime.split('/')[0];
  return specific[mime] || generic[firstPart] || 'Unknown file type';
};
