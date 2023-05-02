import { KeyboardEvent } from 'react';
import { BaseSchema, SetVersion, createMigrate } from '~/lib/schema';

const migrations: Record<number, (settings: any) => any> = {};
export const migrateSettings = createMigrate(migrations);

// Original schema
type SettingsSchemaV1 = SetVersion<BaseSchema, 1> & {
  userKeyboardShortcuts: {
    [key: string]: KeyboardShortcutV1 | null;
  };
};

type KeyboardShortcutV1 = {
  key: string;
  keyLabel?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

const originalDefaultSettings: SettingsSchemaV1 = {
  version: 1,
  userKeyboardShortcuts: {},
};

/**
 * // Add theme
 * type SettingsSchemaV2 = SetVersion<SettingsSchemaV1, 2> & {
 *   theme: string;
 * };
 * 
 * migrations[2] = (settings: SettingsSchemaV1): SettingsSchemaV2 => ({
 *   ...settings,
 *   version: 2,
 *   theme: 'light',
 * });
 */

export type SettingsSchema = SettingsSchemaV1;
export type KeyboardShortcut = KeyboardShortcutV1;
export const LATEST_SETTINGS_VERSION = 1;

export const defaultSettings: SettingsSchema = migrateSettings(
  originalDefaultSettings,
  LATEST_SETTINGS_VERSION
);
