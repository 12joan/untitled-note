const getUserAgentFlag = flag => navigator.userAgent.includes(flag)

export const IS_ELECTRON = getUserAgentFlag('Electron')
export const TABS_SUPPORTED = !IS_ELECTRON || getUserAgentFlag('TabsSupported')
export const TAB_OR_WINDOW = TABS_SUPPORTED ? 'tab' : 'window'
