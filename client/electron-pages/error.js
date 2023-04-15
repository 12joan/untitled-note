const redirectToApp = window.electron.reloadApp;

if (window.location.hash === '#reload') {
  redirectToApp();
} else {
  window.history.replaceState(null, null, '#reload');
}

let easterEgg = null;
const easterEggParts = [
  'you CLICK app icon?',
  ' you click their image like the button?',
  ' oh!',
  ' oh!',
  ' jail for user!',
  ' jail for user for',
  ' One Thousand Years!!!!',
];
let easterEggIndex = -1;

const easterEggHandler = (event) => {
  if (easterEgg === null) {
    easterEgg = document.createElement('p');
    easterEgg.style.fontStyle = 'italic';
    easterEgg.style.fontSize = '1.5em';
    easterEgg.ariaLive = 'assertive';
    event.target.parentNode.appendChild(easterEgg);
  }

  const nextPart = easterEggParts[++easterEggIndex];

  if (nextPart) {
    easterEgg.textContent += nextPart;
  } else {
    easterEgg.remove();
    easterEgg = null;
    easterEggIndex = -1;
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const appIcon = document.getElementById('app-icon');
  appIcon.addEventListener('click', easterEggHandler);

  appIcon.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      easterEggHandler(event);
    }
  });

  document.getElementById('retry').addEventListener('click', () => {
    redirectToApp();
  });
});
