document.addEventListener('DOMContentLoaded', () => {
  const areYouSure = document.querySelector<HTMLInputElement>('#are_you_sure')!;
  const submitButton =
    document.querySelector<HTMLButtonElement>('#delete_account')!;

  areYouSure.addEventListener('change', () => {
    submitButton.disabled = !areYouSure.checked;
  });
});
