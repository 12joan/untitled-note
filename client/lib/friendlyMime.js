const data = {
  generic: {
    image: 'Image',
    audio: 'Audio',
    video: 'Video',
    text: 'Text file',
    font: 'Font file',
  },
  specific: {
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
  },
};

const friendlyMime = (mime) => {
  const firstPart = mime.split('/')[0];
  return data.specific[mime] || data.generic[firstPart] || 'Unknown file type';
};

export default friendlyMime;
