export interface Pageable {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface WithTimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface WithId {
  id: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FilterChip {
  id: string;
  label: string;
  value: string;
  category: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}
