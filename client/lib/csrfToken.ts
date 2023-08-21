export const csrfToken: string = document
  .querySelector('meta[name="csrf-token"]')!
  .getAttribute('content')!;
