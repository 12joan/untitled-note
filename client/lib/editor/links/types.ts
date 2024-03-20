export type LinkData = {
  url: string;
  text: string;
};

export interface LinkModalProps {
  initialText?: string;
  initialUrl?: string;
  onConfirm: (data: LinkData) => void;
}
