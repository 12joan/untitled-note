import { getSnapshotName } from '~/lib/getSnapshotName';
import { Snapshot } from '~/lib/types';

describe('getSnapshotName', () => {
  const snapshotDate = new Date('2021-01-01T00:00:00Z');
  const beforeRestoreDate = new Date('2020-01-02T00:00:00Z');

  const snapshotDateLocaleString = snapshotDate.toLocaleString();
  const beforeRestoreDateLocaleString = beforeRestoreDate.toLocaleString();

  const baseSnapshot = {
    name: 'Snapshot name',
    created_at: snapshotDate.toISOString(),
    before_restore: {
      name: 'Before restore name',
      created_at: beforeRestoreDate.toISOString(),
      is_unrestore: false,
    },
  } satisfies Partial<Snapshot>;

  describe('when snapshot has a name', () => {
    it('returns the name', () => {
      const snapshot = baseSnapshot;
      expect(getSnapshotName(snapshot)).toBe('Snapshot name');
    });
  });

  describe('when snapshot does not have a name', () => {
    const noNameSnapshot = {
      ...baseSnapshot,
      name: '',
    };

    describe('when snapshot has a before_restore', () => {
      describe('when before_restore has a name', () => {
        describe('when before_restore is not an unrestore', () => {
          it('returns the before_restore name', () => {
            const snapshot = noNameSnapshot;
            expect(getSnapshotName(snapshot)).toBe(
              'Before restoring "Before restore name"'
            );
          });
        });

        describe('when before_restore is an unrestore', () => {
          it('returns the before_restore name', () => {
            const snapshot = {
              ...noNameSnapshot,
              before_restore: {
                ...noNameSnapshot.before_restore,
                is_unrestore: true,
              },
            };
            expect(getSnapshotName(snapshot)).toBe(
              'Before restoring "Before restore name"'
            );
          });
        });
      });

      describe('when before_restore does not have a name', () => {
        const noBeforeRestoreNameSnapshot = {
          ...noNameSnapshot,
          before_restore: {
            ...noNameSnapshot.before_restore,
            name: '',
          },
        };

        describe('when before_restore is not an unrestore', () => {
          it('returns the snapshot date', () => {
            const snapshot = noBeforeRestoreNameSnapshot;
            expect(getSnapshotName(snapshot)).toBe(
              `Before restoring "Snapshot ${beforeRestoreDateLocaleString}"`
            );
          });
        });

        describe('when before_restore is an unrestore', () => {
          it('returns the snapshot date', () => {
            const snapshot = {
              ...noBeforeRestoreNameSnapshot,
              before_restore: {
                ...noBeforeRestoreNameSnapshot.before_restore,
                is_unrestore: true,
              },
            };
            expect(getSnapshotName(snapshot)).toBe(
              'Before restoring "Before restoring ..."'
            );
          });
        });
      });

      describe('when before_restore is null', () => {
        const noBeforeRestoreSnapshot = {
          ...noNameSnapshot,
          before_restore: null,
        };

        it('returns the snapshot date', () => {
          const snapshot = noBeforeRestoreSnapshot;
          expect(getSnapshotName(snapshot)).toBe(
            `Snapshot ${snapshotDateLocaleString}`
          );
        });
      });
    });
  });
});
