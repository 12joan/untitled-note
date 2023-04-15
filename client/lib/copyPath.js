const copyPath = (path) => {
  const url = `${window.location.origin}${path}`;

  if (window.location.protocol === 'http:') {
    // eslint-disable-next-line no-console
    console.log(url);
  } else {
    navigator.clipboard.writeText(url);
  }
};

export default copyPath;
