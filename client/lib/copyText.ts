export const copyText = (text: string) => {
  if (window.location.protocol === 'http:') {
    // eslint-disable-next-line no-console
    console.log(text);
  } else {
    navigator.clipboard.writeText(text);
  }
};
