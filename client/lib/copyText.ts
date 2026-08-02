export const copyText = (text: string) => {
  if (window.location.protocol === 'http:') {
    // biome-ignore lint/suspicious/noConsole: logging
    console.log(text);
  } else {
    navigator.clipboard.writeText(text);
  }
};
