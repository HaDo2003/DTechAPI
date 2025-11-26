import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

export const useSignalR = (hubUrl: string, getToken?: () => string | null) => {
  const [connected, setConnected] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => getToken?.() ?? "",
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = conn;

    conn.start()
      .then(() => setConnected(true))
      .catch(err => console.error("SignalR connect error:", err));

    conn.onclose(() => setConnected(false));

    return () => {
      conn.stop();
    };
  }, [hubUrl, getToken]);

  return {
    connection: connectionRef.current,
    connected
  };
};
