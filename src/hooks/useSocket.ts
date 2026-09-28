/**
 * @fileoverview
 * Hook for connecting the frontend to the NestJS WebSocket with socket.io.
 * Connects automatically when a JWT token is available, listens for notification
 * events, and reconnects automatically.
 * @module hooks/useSocket
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
 */

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { authStorage } from '../utilities/authStorage';
import { logConsole } from '../utilities/logConsole';
import { useConexysConfig } from '../config/ConexysConfig';
import { Url } from '../constants/global';

// Extract the WebSocket base URL from the REST API URL.
// If the API is at "http://localhost:3001/restapi/", the WS URL is "http://localhost:3001".
const getWsBaseUrl = (): string => {
  const restApi = Url || 'http://localhost:3001/restapi/';
  // Remove '/restapi/' or '/restapi' from the end.
  return restApi.replace(/\/restapi\/?$/, '');
};

export interface SocketState {
  connected: boolean;
  socketId: string | null;
}

/**
 * Hook that manages the WebSocket connection with JWT authentication.
 * Connects when a token is available and disconnects on unmount.
 *
 * @returns {object} - Connection state and socket ref.
 */
export const useSocket = (): {
  socketRef: React.MutableRefObject<Socket | null>;
  socketState: SocketState;
} => {
  const socketRef = useRef<Socket | null>(null);
  const [socketState, setSocketState] = useState<SocketState>({
    connected: false,
    socketId: null,
  });
  const reconnectAttemptRef = useRef<number>(0);
  const configLogs = useConexysConfig();

  useEffect(() => {
    const token = authStorage.getAuthToken(configLogs);
    if (!token) {
      logConsole(
        configLogs,
        'warn',
        '[WS] ',
        'No hay token, no se conecta WebSocket',
      );
      return;
    }

    // VIII-C3: with an HttpOnly session cookie, JS cannot read the JWT. In that
    // mode the socket must authenticate via the cookie sent in the handshake
    // (withCredentials -> same-origin cookies). We only forward `auth.token`
    // when it is a real JWT (localstorage mode); the 'cookie' marker is not a
    // token and must never be sent as one.
    const isCookieMode = authStorage.getSessionTypeValue(configLogs) === 'cookie';

    const wsUrl = getWsBaseUrl();

    logConsole(configLogs, 'info', '[WS] ', `Conectando a ${wsUrl}...`);

    const socket: Socket = io(wsUrl, {
      ...(isCookieMode ? {} : { auth: { token } }),
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socket.on('connect', () => {
      logConsole(
        configLogs,
        'info',
        '[WS] ',
        `Conectado — Socket ID: ${socket.id}`,
      );
      setSocketState({ connected: true, socketId: socket.id });
      reconnectAttemptRef.current = 0;
    });

    socket.on('disconnect', (reason) => {
      logConsole(configLogs, 'warn', '[WS] ', `Desconectado: ${reason}`);
      setSocketState({ connected: false, socketId: null });
    });

    socket.on('connect_error', (err) => {
      reconnectAttemptRef.current++;
      logConsole(
        configLogs,
        'error',
        '[WS] ',
        `Error de conexión (intento ${reconnectAttemptRef.current}): ${err.message}`,
      );
      setSocketState({ connected: false, socketId: null });
    });

    socket.on('error', (err) => {
      logConsole(configLogs, 'error', '[WS] ', `Error: ${JSON.stringify(err)}`);
    });

    socket.on('pong', (data) => {
      logConsole(configLogs, 'data', '[WS] ', `Pong: ${JSON.stringify(data)}`);
    });

    socketRef.current = socket;

    return () => {
      logConsole(configLogs, 'info', '[WS] ', 'Cerrando conexión...');
      socket.disconnect();
      socketRef.current = null;
      setSocketState({ connected: false, socketId: null });
    };
  }, []); // Solo una vez al montar

  return { socketRef, socketState };
};

export default useSocket;
