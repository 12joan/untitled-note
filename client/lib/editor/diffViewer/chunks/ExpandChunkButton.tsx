import React from 'react';
import { pluralize } from '~/lib/pluralize';
import ExpandIcon from '~/components/icons/ExpandIcon';

export interface ExpandChunkButtonProps {
  blockCount: number;
  onClick: () => void;
}

export const ExpandChunkButton = ({
  blockCount,
  onClick,
}: ExpandChunkButtonProps) => {
  return (
    <button
      type="button"
      className="btn btn-rect btn-secondary w-full flex justify-center gap-2 items-center font-sans"
      onClick={onClick}
    >
      <ExpandIcon noAriaLabel />
      Show {pluralize(blockCount, 'unchanged block')}
    </button>
  );
};
