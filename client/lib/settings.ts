import { useMemo } from 'react';
import { updateSettings } from '~/lib/apis/settings';
import { useAppContext } from '~/lib/appContext';
import { handleUpdateSettingsError } from '~/lib/handleErrors';
import { Future, orDefaultFuture } from '~/lib/monads';
import { Settings } from '~/lib/types';
import { useLocal } from '~/lib/useLocal';

const defaultSettings: Settings = {
  keyboard_shortcut_overrides: {},
  deeper_dark_mode: false,
  editor_style: 'casual',
};

export const useSettingsProvider = (futureSettings: Future<Settings>) => {
  const settingsOrDefault = useMemo(
    () => orDefaultFuture(futureSettings, defaultSettings),
    [futureSettings]
  );

  return useLocal(settingsOrDefault, {
    update: (settings) => updateSettings(settings),
    handleUpdateError: handleUpdateSettingsError,
  });
};

export const useSettings = <K extends keyof Settings>(
  key: K
): [Settings[K], (value: Settings[K]) => void] => {
  const settings = useAppContext('settings');
  const setSettings = useAppContext('setSettings');

  return [
    settings[key],
    (value: Settings[K]) => {
      setSettings({ [key]: value });
    },
  ];
};
