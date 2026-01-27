import { Plugin } from 'obsidian';

export interface FileMetadata {
    path: string;
    hash: string;
    revision: number;
    parentRevision: number;
    updatedAt: number;
}

export class MetadataManager {
    private plugin: Plugin;
    private metadata: Record<string, FileMetadata> = {};

    constructor(plugin: Plugin) {
        this.plugin = plugin;
    }

    async load() {
        // Load data from plugin's data.json (merged with settings)
        // Note: Ideally metadata should be separate from settings to avoid bloat
        // But for simplicity in this version, we might store it under a 'fileMetadata' key in settings
        // Or better, use a separate file adapter. However, plugin.loadData() loads data.json.
        // Let's assume we store it in a separate property if possible or mix it.
        // Actually, let's use a separate file `.honos-sync-meta.json` in the vault root (hidden) or adapter.
        // But the easiest way is plugin.saveData({ settings: ..., metadata: ... })
        // Let's modify SyncPluginSettings to include metadata store.

        // Wait, main.ts uses loadSettings which loads data.json
        // We should hook into that.
    }

    // Changing Strategy: Store metadata in memory map and persist to data.json
    // via the main plugin settings object.

    getMetadata(path: string): FileMetadata | null {
        return this.metadata[path] || null;
    }

    updateMetadata(path: string, meta: Partial<FileMetadata>) {
        const current = this.metadata[path] || {
            path,
            hash: '',
            revision: 0,
            parentRevision: 0,
            updatedAt: Date.now()
        };

        this.metadata[path] = {
            ...current,
            ...meta,
            updatedAt: Date.now()
        };
    }

    deleteMetadata(path: string) {
        delete this.metadata[path];
    }

    getAllMetadata() {
        return this.metadata;
    }

    setAllMetadata(data: Record<string, FileMetadata>) {
        this.metadata = data || {};
    }
}
