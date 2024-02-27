import { PlateRenderElementProps, TElement, Value } from '@udecode/plate';
import { S3File } from '~/lib/types';

export interface AttachmentPlugin {
  projectId: number;
  availableSpace: number;
  showFileStorage: () => void;
}

export interface AttachmentElement extends TElement {
  s3FileId: number;
  filename: string;
}

export type AttachmentElementProps = PlateRenderElementProps<
  Value,
  AttachmentElement
>;

export interface BaseAttachmentProps {
  className?: string;
}

export interface ExtantAttachmentProps extends BaseAttachmentProps {
  s3File: S3File;
}
