// TODO: Remove me
import { Document } from '~/lib/types';

export interface EditorProps {
  clientId: string;
  initialDocument: Document;
}

export default function Editor(props: EditorProps): JSX.Element;
