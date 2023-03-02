import '~/lib/commonEntrypoint'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#application').classList.remove('prevent-fouc')
})
