export interface FileStorage {
  id: number;
  name: string;
  extension: string;
  contentType: string;
  associatedEntityType: string;
  associatedEntityId: number;
  description: FileDescription;
  data: string; // Assuming Base64 string
}

export enum FileDescription {
  IMAGE = 'IMAGE', DOCUMENT = 'DOCUMENT'
}
export interface FileStorageDto {
  id: number;
  name: string;
  extension: string;
  contentType: string;
  associatedEntityType: string;
  associatedEntityId: number;
  description: FileDescription;
}
