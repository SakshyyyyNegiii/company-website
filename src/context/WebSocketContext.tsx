import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface WebSocketEventMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

interface WebSocketContextType {
  status: WebSocketStatus;
  isConnected: boolean;
  activeUsersCount: number;
  latencyMs: number;
  lastEvent: WebSocketEventMessage | null;
  sendMessage: (type: string, data?: any) => void;
  systemMetrics: {
    throughput: string;
    serverUptimeMs: number;
    appointmentsCount: number;
    inquiriesCount: number;
  };
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<WebSocketStatus>('connecting');
  const [activeUsersCount, setActiveUsersCount] = useState<number>(1);
  const [latencyMs, setLatencyMs] = useState<number>(14);
  const [lastEvent, setLastEvent] = useState<WebSocketEventMessage | null>(null);
  const [systemMetrics, setSystemMetrics] = useState({
    throughput: '14.8k req/s',
    serverUptimeMs: 0,
    appointmentsCount: 0,
    inquiriesCount: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const pingStartTimeRef = useRef<number>(0);
  const reconnectAttemptsRef = useRef<number>(0);

  const connect = useCallback(() => {
    // Clean up existing socket if any
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    try {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
      const wsUrl = `${wsProtocol}//${host}/ws`;

      setStatus(reconnectAttemptsRef.current > 0 ? 'reconnecting' : 'connecting');

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        reconnectAttemptsRef.current = 0;

        // Measure live round-trip latency via ping/pong
        pingStartTimeRef.current = Date.now();
        try {
          ws.send(JSON.stringify({ type: 'ping', timestamp: pingStartTimeRef.current }));
        } catch {
          // ignore
        }

        // Set up periodic ping every 15 seconds
        if (pingIntervalRef.current) window.clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            pingStartTimeRef.current = Date.now();
            try {
              ws.send(JSON.stringify({ type: 'ping', timestamp: pingStartTimeRef.current }));
            } catch {
              // ignore
            }
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        try {
          const parsed: WebSocketEventMessage = JSON.parse(event.data);
          setLastEvent(parsed);

          if (parsed.type === 'pong') {
            const now = Date.now();
            const roundTrip = Math.max(4, now - (parsed.data?.clientTimestamp || pingStartTimeRef.current));
            setLatencyMs(roundTrip);
          } else if (parsed.type === 'presence:update') {
            if (typeof parsed.data?.activeUsers === 'number') {
              setActiveUsersCount(parsed.data.activeUsers);
            }
          } else if (parsed.type === 'init') {
            if (parsed.data?.activeUsers) {
              setActiveUsersCount(parsed.data.activeUsers);
            }
            if (parsed.data?.systemMetrics) {
              setSystemMetrics((prev) => ({
                ...prev,
                ...parsed.data.systemMetrics,
                serverUptimeMs: parsed.data.serverUptimeMs || prev.serverUptimeMs,
                appointmentsCount: parsed.data.appointmentsCount || prev.appointmentsCount,
                inquiriesCount: parsed.data.inquiriesCount || prev.inquiriesCount,
              }));
            }
          } else if (parsed.type === 'telemetry:update') {
            if (parsed.data) {
              setSystemMetrics((prev) => ({
                ...prev,
                ...parsed.data,
              }));
            }
          }
        } catch {
          // non-json frame
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        if (pingIntervalRef.current) {
          window.clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Auto-reconnect with exponential backoff (1s, 2s, 4s, capped at 10s)
        const delay = Math.min(10000, Math.pow(2, reconnectAttemptsRef.current) * 1000);
        reconnectAttemptsRef.current += 1;
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect();
        }, delay);
      };

      ws.onerror = () => {
        // Handled gracefully in onclose
      };
    } catch {
      setStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) window.clearInterval(pingIntervalRef.current);
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, [connect]);

  // Telemetry fallback polling if WebSocket is temporarily disconnected or restricted
  useEffect(() => {
    if (status !== 'connected') {
      const poll = async () => {
        try {
          const res = await fetch('/api/system/status');
          if (res.ok) {
            const data = await res.json();
            if (data.activeAppointmentsCount !== undefined) {
              setSystemMetrics((prev) => ({
                ...prev,
                appointmentsCount: data.activeAppointmentsCount,
                inquiriesCount: data.activeInquiriesCount,
              }));
              if (data.latencyMs) setLatencyMs(data.latencyMs);
            }
          }
        } catch {
          // ignore offline
        }
      };

      poll();
      const intervalId = window.setInterval(poll, 8000);
      return () => window.clearInterval(intervalId);
    }
  }, [status]);

  const sendMessage = useCallback((type: string, data?: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type, data, timestamp: Date.now() }));
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        status,
        isConnected: status === 'connected',
        activeUsersCount,
        latencyMs,
        lastEvent,
        sendMessage,
        systemMetrics,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
