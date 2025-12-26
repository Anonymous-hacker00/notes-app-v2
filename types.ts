
export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  tags: string[];
}

export type ViewMode = 'edit' | 'preview';
