export interface UserData {
  username: string;
  grade_level: string;
  email: string;
  google_id: string;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  grade_level: number;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  chapter_id: number;
  resource_type: ResourceType;
  content: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  subject_id: number;
  order: number;
  created_at: string;
  updated_at: string;
  resources: Resource[];
}

export type ResourceType = 'text' | 'video' | 'pdf' | 'image' | 'link' | 'quiz' | 'assignment' | 'practice';

export interface GoogleUser {
  email: string;
  sub: string;
  name: string;
  picture: string;
} 