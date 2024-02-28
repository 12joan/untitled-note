import { getSnapshotName } from '~/lib/getSnapshotName';
import { Snapshot } from '~/lib/types';

describe('getSnapshotName', () => {
  const snapshotDate = new Date('2021-01-01T00:00:00Z');
  const restoresSnapshotDate = new Date('2020-01-02T00:00:00Z');

  const snapshotDateLocaleString = snapshotDate.toLocaleString();
  const restoresSnapshotDateLocaleString =
    restoresSnapshotDate.toLocaleString();

  const baseSnapshot = {
    name: 'Alice',
    created_at: snapshotDate.toISOString(),
    restores_snapshot: {
      name: 'Bob',
      created_at: restoresSnapshotDate.toISOString(),
    } satisfies Partial<Snapshot> as any as Snapshot,
  } satisfies Partial<Snapshot> as any as Snapshot;

  describe('when snapshot has a name', () => {
    it('returns the name', () => {
      const snapshot = baseSnapshot;
      expect(getSnapshotName(snapshot)).toBe('Alice');
    });
  });

  describe('when snapshot does not have a name', () => {
    const noNameSnapshot = {
      ...baseSnapshot,
      name: '',
    };

    describe('when snapshot is a restore', () => {
      describe('when restores_snapshot has a name', () => {
        it('returns the restores_snapshot name', () => {
          const snapshot = noNameSnapshot;
          expect(getSnapshotName(snapshot)).toBe('Restore "Bob"');
        });
      });

      describe('when restores_snapshot does not have a name', () => {
        const noRestoresSnapshotNameSnapshot = {
          ...noNameSnapshot,
          restores_snapshot: {
            ...noNameSnapshot.restores_snapshot,
            name: '',
          } as any as Snapshot,
        };

        it('returns the snapshot date', () => {
          const snapshot = noRestoresSnapshotNameSnapshot;
          expect(getSnapshotName(snapshot)).toBe(
            `Restore "Snapshot ${restoresSnapshotDateLocaleString}"`
          );
        });
      });

      describe('when snapshot is not a restore', () => {
        const noRestoreSnapshot = {
          ...noNameSnapshot,
          restores_snapshot: null,
        };

        it('returns the snapshot date', () => {
          const snapshot = noRestoreSnapshot;
          expect(getSnapshotName(snapshot)).toBe(
            `Snapshot ${snapshotDateLocaleString}`
          );
        });
      });
    });
  });
});
