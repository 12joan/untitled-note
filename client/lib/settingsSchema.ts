import { BaseSchema, createMigrate, SetVersion } from '~/lib/schema';

const migrations: Record<number, (settings: any) => any> = {};
export const migrateSettings = createMigrate(migrations);

// Schema v1: Original schema
type SettingsSchemaV1 = SetVersion<BaseSchema, 1> & {
  keyboardShortcutOverrides: {
    [key: string]: KeyboardShortcutConfigV1 | null;
  };
};

type KeyboardShortcutConfigV1 = {
  key: string;
  keyLabel?: string;
  customComparison?: {
    property: keyof KeyboardEvent;
    value: any;
  };
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

const originalDefaultSettings: SettingsSchemaV1 = {
  version: 1,
  keyboardShortcutOverrides: {},
};

// Schema v2: Add deeper dark mode option
type SettingsSchemaV2 = SetVersion<SettingsSchemaV1, 2> & {
  deeperDarkMode: boolean;
};

migrations[2] = (settings: SettingsSchemaV1): SettingsSchemaV2 => ({
  ...settings,
  version: 2,
  deeperDarkMode: false,
});

// Add migrations here

// Update these when schema changes
export type SettingsSchema = SettingsSchemaV2;
export const LATEST_SETTINGS_VERSION = 2;

export type KeyboardShortcutConfig = KeyboardShortcutConfigV1;

export const defaultSettings: SettingsSchema = migrateSettings(
  originalDefaultSettings,
  LATEST_SETTINGS_VERSION
);
