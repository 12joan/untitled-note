export type EditorStyle = 'casual' | 'literary';

export type Project = {
  id: number;
  name: string;
  image_url: string | null;
  emoji: string | null;
  background_colour: string;
  editor_style: EditorStyle | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type Tag = {
  id: number;
  text: string;
  project_id: Project['id'];
  documents_count: number;
  created_at: string;
  updated_at: string;
};

export type LocalTag = Partial<Tag> & {
  localId?: any;
  text: string;
};

export type Document = {
  id: number;
  title: string;
  safe_title: string;
  preview: string;
  body: string;
  body_type: string;
  tags: Tag[];
  editor_style: EditorStyle | null;
  blank: boolean;
  updated_by: string;
  created_at: string;
  updated_at: string;
  pinned_at: string | null;
  locked_at: string | null;
};

export type LocalDocument = Omit<Document, 'tags'> & {
  tags: LocalTag[];
};

export type PartialDocument = Pick<
  Document,
  | 'id'
  | 'title'
  | 'safe_title'
  | 'preview'
  | 'blank'
  | 'body_type'
  | 'updated_by'
  | 'updated_at'
  | 'pinned_at'
  | 'locked_at'
>;

export type DocumentSearchResult = {
  document: {
    id: Document['id'];
    title: Document['title'];
    safe_title: Document['safe_title'];
    plain_body: string;
    project_id: Project['id'];
  };
  highlights: {
    field: string;
    snippet: string;
  }[];
};

export type S3File = {
  id: number;
  role: 'project-image' | 'attachment';
  filename: string;
  size: number;
  content_type: string;
  url: string;
  created_at: string;
  became_unused_at: string | null;
  do_not_delete_unused: boolean;
};

export type Snapshot = {
  id: number;
  name: string;
  manual: boolean;
  body: string;
  document_id: Document['id'];
  created_at: string;
  updated_at: string;
};

export type StorageQuotaUsage = {
  quota: number;
  used: number;
};

export type Toast = {
  id: string;
  title: string;
  message: string | (() => React.ReactNode);
  autoClose: 'none' | 'fast' | 'slow';
  ariaLive?: 'off' | 'polite' | 'assertive';
  button?: {
    label: string;
    onClick: () => void;
  };
};

export type ToastWithoutId = Omit<Toast, 'id'> & {
  id?: string;
};

export type Query = 'all' | boolean | { [property: string]: Query };

export type Stream = {
  unsubscribe: () => void;
};

export type StreamCacheWorkerAPI = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, data: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
};
