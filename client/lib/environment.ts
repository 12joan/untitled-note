const getUserAgentFlag = (flag: string) => navigator.userAgent.includes(flag);

export const IS_ELECTRON: boolean = getUserAgentFlag('Electron');

export const TABS_SUPPORTED: boolean =
  !IS_ELECTRON || getUserAgentFlag('TabsSupported');
export const TAB_OR_WINDOW: 'tab' | 'window' = TABS_SUPPORTED
  ? 'tab'
  : 'window';

export const FIND_SUPPORTED: boolean = getUserAgentFlag('FindSupported');

export const IS_APPLE: boolean = getUserAgentFlag('Mac OS X');
export const IS_WINDOWS: boolean = getUserAgentFlag('Windows');
export const IS_CHROME: boolean = getUserAgentFlag('Chrome');
export const IS_FIREFOX: boolean = getUserAgentFlag('Firefox');
export const IS_SAFARI: boolean = getUserAgentFlag('Safari');

export type OperatingSystem = 'mac' | 'windows' | 'other';
export type Browser = 'chrome' | 'firefox' | 'safari' | 'other';

export const OPERATING_SYSTEM: OperatingSystem = (() => {
  if (IS_APPLE) return 'mac';
  if (IS_WINDOWS) return 'windows';
  return 'other';
})();

export const BROWSER: Browser = (() => {
  if (IS_CHROME) return 'chrome';
  if (IS_FIREFOX) return 'firefox';
  if (IS_SAFARI) return 'safari';
  return 'other';
})();

type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
type By<K extends string, T> = OptionalExcept<
  Record<K | 'default', T>,
  'default'
>;

export type EnvironmentSpecific<T> =
  | T
  | { byOS: By<OperatingSystem, T> }
  | { byBrowser: By<Browser, T> };

export const envSpecific = <T>(value: EnvironmentSpecific<T>): T => {
  if (value && typeof value === 'object' && 'byOS' in value) {
    return envSpecific(value.byOS[OPERATING_SYSTEM] || value.byOS.default);
  }

  if (value && typeof value === 'object' && 'byBrowser' in value) {
    return envSpecific(value.byBrowser[BROWSER] || value.byBrowser.default);
  }

  return value;
};
