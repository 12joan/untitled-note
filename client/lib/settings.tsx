import { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '~/lib/apis/settings';
import { useContext } from '~/lib/context';
import {
  FutureServiceResult,
  orDefaultFutureServiceResult,
  pendingFutureServiceResult,
  promiseToFutureServiceResult,
} from '~/lib/monads';
import {
  defaultSettings,
  LATEST_SETTINGS_VERSION,
  migrateSettings,
  SettingsSchema,
} from '~/lib/settingsSchema';
import { useOverrideable } from '~/lib/useOverrideable';

type SettingsContext = {
  settings: SettingsSchema;
  setSettings: (settings: SettingsSchema) => void;
};

export const useSettingsProvider = (): SettingsContext => {
  const [fsrSettings, setFsrSettings] = useState<
    FutureServiceResult<SettingsSchema, any>
  >(pendingFutureServiceResult);

  useEffect(() => {
    // TODO: Handle errors
    promiseToFutureServiceResult(
      fetchSettings().then((settings: any) => {
        if (settings) {
          return migrateSettings(
            settings,
            LATEST_SETTINGS_VERSION
          ) as SettingsSchema;
        }

        return defaultSettings;
      }),
      setFsrSettings
    );
  }, []);

  const [settings, overrideSettings] = useOverrideable(
    orDefaultFutureServiceResult(fsrSettings, defaultSettings)
  );

  const setSettings = (settings: SettingsSchema) => {
    overrideSettings(settings);

    // TODO: Handle errors
    updateSettings(settings);
  };

  return { settings, setSettings };
};

export function useSettings(): [
  SettingsSchema,
  (settings: SettingsSchema) => void
];
export function useSettings<K extends keyof SettingsSchema>(
  key: K
): [SettingsSchema[K], (value: SettingsSchema[K]) => void];

export function useSettings<K extends keyof SettingsSchema>(key?: K) {
  const { settings, setSettings } = useContext() as SettingsContext;

  if (key) {
    return [
      settings[key],
      (value: SettingsSchema[K]) =>
        setSettings({
          ...settings,
          [key]: value,
        }),
    ];
  }

  return [settings, setSettings];
}