export interface UploadOptions {
  expires?: string;
  maxDownloads?: number;
}

export interface UploadProgress {
  stage: 'encrypting' | 'uploading' | 'complete' | 'error';
  percentage: number;
  bytesProcessed: number;
  totalBytes: number;
  speed?: number;
  eta?: number;
}

export interface UploadResult {
  fileId: string;
  url: string;
  expiresAt: string;
}

export interface StorageData {
  recentUploads: UploadResult[];
  settings: {
    defaultExpires: string;
    defaultMaxDownloads: number;
    autoClipboard: boolean;
    notifications: boolean;
  };
}
