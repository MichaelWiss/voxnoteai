export interface Note {
  id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  title?: string;
  type?: string;
  file_url?: string;
  transcript?: string;
  summary?: string;
  media_url?: string;
  tags?: (string | { name: string })[];
}

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface NoteTag {
  note_id: string;
  tag_id: string;
}
