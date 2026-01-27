export async function calculateHash(content: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function splitIntoChunks(content: string): string[] {
    // Simple implementation: single chunk for small files
    // For large files, logic can be added here
    return [content];
}
