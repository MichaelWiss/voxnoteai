export interface Note {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  type?: string;
  file_url?: string;
  transcript?: string;
  summary?: string;
  media_url?: string;
  tags?: string[];
}
