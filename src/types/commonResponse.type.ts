export interface GenericResponse<T> {
  success: boolean;
  data: T;
  code: string;
  message: string;
  timestamp: string;
  errors?: string[];
  path?: string;
}

export interface Pageable {
  size?: number;
  totalElements?: number;
  totalPages?: number;
  number?: number;
}

export interface PageResponse<T> {
  content: T[];
  page: Pageable;
  links: any[];
}