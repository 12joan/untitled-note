import cssHasPseudo from 'css-has-pseudo/browser';

cssHasPseudo(document, { hover: true });

const isTouchDevice =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

if (!isTouchDevice) {
  let wasInFocus;

  setInterval(() => {
    const inFocus = document.hasFocus();

    if (inFocus !== wasInFocus) {
      wasInFocus = inFocus;

      if (inFocus) {
        document.body.classList.remove('inactive');
      } else {
        document.body.classList.add('inactive');
      }
    }
  }, 100);
}

new MutationObserver((mutations) =>
  mutations.forEach(({ type, target }) => {
    // childList refers to the addition or removal of nodes in the DOM tree;
    // no relation to ul or ol specifically
    if (type === 'childList') {
      const orderedLists = target.matches('ol')
        ? [target]
        : target.querySelectorAll('ol');

      orderedLists.forEach((list) => {
        const digits = Math.max(
          Math.floor(Math.log10(list.children.length)) + 1,
          0
        );
        list.style.setProperty('--list-style-offset', `${digits}ch`);
      });
    }
  })
).observe(document.body, { childList: true, subtree: true });
