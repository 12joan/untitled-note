import ExpandIcon from '~/components/icons/ExpandIcon';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { pluralize } from '~/lib/pluralize';

export interface ExpandChunkButtonProps {
  blockCount: number;
  onClick: () => void;
}

export const ExpandChunkButton = ({
  blockCount,
  onClick,
}: ExpandChunkButtonProps) => (
  <button
    type="button"
    className={groupedClassNames({
      btn: 'btn btn-rect btn-secondary w-full',
      flex: 'flex justify-center gap-2 items-center',
      reset: 'reset-editor-style',
    })}
    onClick={onClick}
  >
    <ExpandIcon noAriaLabel />
    Show {pluralize(blockCount, 'unchanged block')}
  </button>
);
