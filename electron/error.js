const redirectToApp = () => window.location.href = 'http://localhost:3000/'

if (window.location.hash === '#reload') {
  redirectToApp()
} else {
  history.replaceState(null, null, '#reload')
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('retry').addEventListener('click', () => {
    redirectToApp()
  })
})
