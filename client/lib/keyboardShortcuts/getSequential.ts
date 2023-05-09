export const getSequential = (event: KeyboardEvent) =>
  parseInt(event.code.replace('Digit', ''), 10);
