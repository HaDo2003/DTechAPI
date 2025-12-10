import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

/**
 * Connection pool entry structure
 * Stores shared connections to prevent duplicate connections to the same hub
 */
interface PoolEntry {
  connection: signalR.HubConnection;
  referenceCount: number;
  subscribers: Set<(isConnected: boolean) => void>;
  cleanupTimer?: ReturnType<typeof setTimeout>;
}

// Global pool to share connections across components
const connectionPool = new Map<string, PoolEntry>();

// Delay before actually closing a connection (handles React remounts)
const CLEANUP_DELAY = 100;

export const useSignalR = (token?: string | null) => {
  const [_, setConnected] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const hubUrl = "https://localhost:7094/hubs/chatsHub";

  useEffect(() => {
    if (!token) {
      setConnected(false);
      return;
    }

    if (!hubUrl) {
      setConnected(false);
      return;
    }

    const existingEntry = connectionPool.get(hubUrl);

    // Reuse existing connection if available
    if (existingEntry) {
      // Cancel any pending cleanup
      if (existingEntry.cleanupTimer) {
        clearTimeout(existingEntry.cleanupTimer);
        existingEntry.cleanupTimer = undefined;
      }

      // Increment reference count and subscribe this component
      existingEntry.referenceCount++;
      existingEntry.subscribers.add(setConnected);
      connectionRef.current = existingEntry.connection;

      // Update connection state
      const isCurrentlyConnected =
        existingEntry.connection.state === signalR.HubConnectionState.Connected;
      setConnected(isCurrentlyConnected);
    }
    // Create new connection if none exists
    else {
      // Build SignalR connection
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token || "",
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Error)
        .build();

      // Initialize subscribers set
      const subscribers = new Set([setConnected]);

      // Helper function to notify all subscribers of connection state changes
      const notifySubscribers = (isConnected: boolean) => {
        subscribers.forEach(callback => callback(isConnected));
      };

      // Set up connection event handlers
      newConnection.onclose(() => {
        console.log("SignalR disconnected");
        notifySubscribers(false);
      });

      newConnection.onreconnecting(() => {
        console.log("SignalR reconnecting...");
        notifySubscribers(false);
      });

      newConnection.onreconnected(() => {
        console.log("SignalR reconnected");
        notifySubscribers(true);
      });

      // Start the connection
      newConnection.start()
        .then(() => {
          console.log("SignalR connected successfully");
          notifySubscribers(true);
        })
        .catch(() => {
          // Error already logged by SignalR at Error level
        });

      // Store in pool
      const newEntry: PoolEntry = {
        connection: newConnection,
        referenceCount: 1,
        subscribers
      };
      connectionPool.set(hubUrl, newEntry);
      connectionRef.current = newConnection;
    }

    // Cleanup function when component unmounts
    return () => {
      const entry = connectionPool.get(hubUrl);
      if (!entry) return;

      // Remove this component from subscribers
      entry.subscribers.delete(setConnected);

      // Schedule connection cleanup with delay (handles React Strict Mode)
      entry.cleanupTimer = setTimeout(async () => {
        entry.referenceCount--;

        // Only close connection if no components are using it
        if (entry.referenceCount <= 0) {
          connectionPool.delete(hubUrl);

          const isConnected =
            entry.connection.state === signalR.HubConnectionState.Connected;

          if (isConnected) {
            await entry.connection.stop().catch(() => {
              // Ignore stop errors
            });
          }
        }
      }, CLEANUP_DELAY);
    };
  }, [hubUrl, token]);

  return {
    connection: connectionRef.current
  };
};