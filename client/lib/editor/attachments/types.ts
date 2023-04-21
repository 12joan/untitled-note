import {
  PlateRenderElementProps,
  TElement,
  Value,
} from '@udecode/plate-headless';
import { GroupedClassNames } from '~/lib/groupedClassNames';
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
  selectedClassNames: GroupedClassNames;
}

export interface ExtantAttachmentProps extends BaseAttachmentProps {
  s3File: S3File;
}
