import { FileMetadata } from './MetadataManager';

/**
 * Plugin Settings Interface
 */
export interface SyncPluginSettings {
    token: string;
    deviceName: string;
    autoSync: boolean;
    syncInterval: number; // in minutes
    // Store metadata in settings for persistence
    filesMetadata: Record<string, FileMetadata>;
}

/**
 * Default plugin settings
 */
export const DEFAULT_SETTINGS: SyncPluginSettings = {
    token: '',
    deviceName: 'Obsidian Device',
    autoSync: false,
    syncInterval: 5,
    filesMetadata: {},
};

export const SERVER_URL = 'https://api.honos.dev';

/**
 * User info from API
 */
export interface UserInfo {
    id: string;
    email: string;
    role: 'user' | 'admin';
}

/**
 * Auth Verify Response
 */
export interface AuthVerifyResponse {
    success: boolean;
    user?: UserInfo;
    error?: string;
}

/**
 * File info from server (V2)
 */
export interface RemoteFile {
    path: string;
    hash: string;
    size: number;
    revision: number;
    parentRevision: number | null;
    isConflict: boolean;
    isDeleted?: boolean;
    updatedAt: string;
}

/**
 * File List Response (V2)
 */
export interface FileListResponse {
    success: boolean;
    files?: RemoteFile[];
    totalFiles?: number;
    totalSize?: number;
    error?: string;
}

/**
 * File Download Response (V2)
 */
export interface FileDownloadResponse {
    success: boolean;
    file?: RemoteFile & {
        content: string; // V2 returns content inside file object
        deviceId?: string;
    };
    error?: string;
}

/**
 * Conflict Data (V2)
 */
export interface ConflictInfo {
    currentRevision: number;
    yourParentRevision: number;
    conflictFile: {
        revision: number;
        hash: string;
        updatedAt: string;
        deviceId: string;
    };
}

/**
 * File Upload Response (V2)
 */
export interface FileUploadResponse {
    success: boolean;
    revision?: number;
    message?: string;
    error?: string;
    conflict?: ConflictInfo; // 409 Conflict data
}

/**
 * File Delete Response (V2)
 */
export interface FileDeleteResponse {
    success: boolean;
    revision?: number;
    message?: string;
    error?: string;
    conflict?: ConflictInfo;
}

/**
 * Sync Status Response (Legacy/Mixed)
 */
export interface SyncStatusResponse {
    success: boolean;
    status?: any;
    error?: string;
}
