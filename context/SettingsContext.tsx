import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'system' | 'light' | 'dark';

interface Settings {
  sound: boolean;
  haptics: boolean;
  theme: ThemePreference;
}

interface SettingsContextValue extends Settings {
  setSound: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  setTheme: (v: ThemePreference) => void;
}

const SETTINGS_KEY = '@magic_number_settings_v1';

const defaults: Settings = {
  sound: true,
  haptics: true,
  theme: 'system',
};

const SettingsContext = createContext<SettingsContextValue>({
  ...defaults,
  setSound: () => {},
  setHaptics: () => {},
  setTheme: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaults);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (raw) setSettings((prev) => ({ ...prev, ...(JSON.parse(raw) as Partial<Settings>) }));
    });
  }, []);

  const update = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setSound: (v) => update({ sound: v }),
        setHaptics: (v) => update({ haptics: v }),
        setTheme: (v) => update({ theme: v }),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
