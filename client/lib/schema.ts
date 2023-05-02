export type BaseSchema = {
  version: number;
};

export type SetVersion<T extends BaseSchema, V extends number> = Omit<T, 'version'> & {
  version: V;
};

export const omit = <T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
  const { [key]: _, ...rest } = obj;
  return rest;
};

export const createMigrate = (
  migrations: {
    [key: number]: (settings: any) => any;
  }
) => {
  const migrate = <
    OldValue extends BaseSchema,
    TargetVersion extends number,
    TargetValue extends SetVersion<BaseSchema, TargetVersion>
  >(
    value: OldValue,
    targetVersion: TargetVersion,
  ): TargetValue => {
    const currentVersion = value.version;

    if (currentVersion > targetVersion) {
      throw new Error(`Cannot migrate from version ${currentVersion} to version ${targetVersion}`);
    }

    if (currentVersion === targetVersion) {
      return value as any;
    }

    const atPreviousVersion = migrate(value, targetVersion - 1);

    const migration = migrations[targetVersion];

    if (!migration) {
      throw new Error(`No migration found for version ${targetVersion}`);
    }

    return migration(atPreviousVersion);
  };

  return migrate;
};
