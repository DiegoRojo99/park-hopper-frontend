export type ImageType = 'MAIN' | 'LOGO' | 'GALLERY' | 'PREVIEW' | 'THUMBNAIL';

export interface Image {
  id: string;
  url: string;
  type: ImageType;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// For API responses where Date objects are serialized as strings
export interface ImageSerialized extends Image {
  createdAt: string;
  updatedAt: string;
}