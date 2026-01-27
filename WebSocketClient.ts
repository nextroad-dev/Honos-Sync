import { Notice } from 'obsidian';
import { SERVER_URL } from './types';

export class WebSocketClient {
    private ws: WebSocket | null = null;
    private token: string;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private isConnecting: boolean = false;
    private onFileChangeCallback: ((event: any) => void) | null = null;
    private onStatusChangeCallback: ((connected: boolean) => void) | null = null;

    constructor(token: string) {
        this.token = token;
    }

    connect() {
        if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
            return;
        }

        this.isConnecting = true;
        const wsUrl = SERVER_URL.replace('https://', 'wss://').replace('http://', 'ws://') + '/obsidian/ws/connect';

        console.log('[WS] Connecting to:', wsUrl);

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('[WS] Connected');
                this.isConnecting = false;

                // Send authentication message
                this.send({ type: 'auth', token: this.token });

                this.onStatusChangeCallback?.(true);

                // Start heartbeat
                this.startHeartbeat();
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('[WS] Received:', message);

                    if (message.event === 'authenticated') {
                        new Notice(`✅ Real-time sync connected`);
                    } else if (message.event === 'file_change') {
                        this.onFileChangeCallback?.(message.data);
                    } else if (message.error) {
                        console.error('[WS] Server error:', message.error);
                        new Notice(`WS Error: ${message.error}`);
                    }
                } catch (err) {
                    console.error('[WS] Parse error:', err);
                }
            };

            this.ws.onerror = (error) => {
                console.error('[WS] Error:', error);
                this.isConnecting = false;
            };

            this.ws.onclose = () => {
                console.log('[WS] Disconnected');
                this.isConnecting = false;
                this.onStatusChangeCallback?.(false);

                // Attempt reconnect after 5 seconds
                this.scheduleReconnect();
            };
        } catch (err) {
            console.error('[WS] Connection failed:', err);
            this.isConnecting = false;
            this.scheduleReconnect();
        }
    }

    private send(data: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    private startHeartbeat() {
        // Send ping every 30 seconds
        setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ type: 'ping' });
            }
        }, 30000);
    }

    private scheduleReconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        this.reconnectTimer = setTimeout(() => {
            console.log('[WS] Attempting reconnect...');
            this.connect();
        }, 5000);
    }

    disconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    onFileChange(callback: (event: any) => void) {
        this.onFileChangeCallback = callback;
    }

    onStatusChange(callback: (connected: boolean) => void) {
        this.onStatusChangeCallback = callback;
    }

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
}
