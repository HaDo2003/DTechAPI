import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

const pool = new Map<string, {
  conn: signalR.HubConnection;
  refs: number;
  subs: Set<(s: boolean) => void>;
  timer?: ReturnType<typeof setTimeout>;
}>();

export const useSignalR = (hubUrl: string, token?: string | null) => {
  const [connected, setConnected] = useState(false);
  const connRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!token) {
      setConnected(false);
      return;
    }

    let entry = pool.get(hubUrl);

    if (entry) {
      clearTimeout(entry.timer);
      entry.refs++;
      entry.subs.add(setConnected);
      connRef.current = entry.conn;
      setConnected(entry.conn.state === signalR.HubConnectionState.Connected);
    } else {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token || "",
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Error)
        .build();

      const subs = new Set([setConnected]);
      const broadcast = (s: boolean) => subs.forEach(fn => fn(s));

      conn.onclose(() => {
        console.log("SignalR disconnected");
        broadcast(false);
      });
      conn.onreconnecting(() => {
        console.log("SignalR reconnecting...");
        broadcast(false);
      });
      conn.onreconnected(() => {
        console.log("SignalR reconnected");
        broadcast(true);
      });

      conn.start()
        .then(() => {
          console.log("SignalR connected successfully");
          broadcast(true);
        })
        .catch(() => {});

      entry = { conn, refs: 1, subs };
      pool.set(hubUrl, entry);
      connRef.current = conn;
    }

    return () => {
      const e = pool.get(hubUrl);
      if (!e) return;

      e.subs.delete(setConnected);
      e.timer = setTimeout(async () => {
        if (--e.refs <= 0) {
          pool.delete(hubUrl);
          if (e.conn.state === signalR.HubConnectionState.Connected) {
            await e.conn.stop().catch(() => {});
          }
        }
      }, 100);
    };
  }, [hubUrl, token]);

  return { connection: connRef.current, connected };
};