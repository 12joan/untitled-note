const getUserAgentFlag = (flag: string) => navigator.userAgent.includes(flag);

export const IS_ELECTRON: boolean = getUserAgentFlag('Electron');

export const TABS_SUPPORTED: boolean =
  !IS_ELECTRON || getUserAgentFlag('TabsSupported');
export const TAB_OR_WINDOW: 'tab' | 'window' = TABS_SUPPORTED
  ? 'tab'
  : 'window';

export const FIND_SUPPORTED: boolean = getUserAgentFlag('FindSupported');
