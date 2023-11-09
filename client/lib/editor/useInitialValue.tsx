import { useMemo } from 'react';
import {
  createPlateEditor,
  deserializeHtml,
  ELEMENT_PARAGRAPH,
  PlatePlugin,
} from '@udecode/plate';
import { Document } from '~/lib/types';

export type UseInitialValueOptions = {
  initialDocument: Document;
  plugins: PlatePlugin[];
};

export const useInitialValue = ({
  initialDocument,
  plugins,
}: UseInitialValueOptions) =>
  useMemo(() => {
    const bodyFormat = initialDocument.body_type.split('/')[0];
    const emptyDocument = [
      { type: ELEMENT_PARAGRAPH, children: [{ text: '' }] },
    ];

    if (bodyFormat === 'empty') {
      return emptyDocument;
    }

    if (bodyFormat === 'html') {
      const tempEditor = createPlateEditor({ plugins });

      const initialValue = deserializeHtml(tempEditor, {
        element: initialDocument.body,
      });

      return initialValue[0]?.type ? initialValue : emptyDocument;
    }

    if (bodyFormat === 'json') {
      return JSON.parse(initialDocument.body);
    }

    throw new Error(`Unknown body format: ${bodyFormat}`);
  }, []);
