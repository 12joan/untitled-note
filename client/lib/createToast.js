import { dispatchGlobalEvent } from '~/lib/globalEvents'

const createToast = toast => dispatchGlobalEvent('toast', toast)

export default createToast
