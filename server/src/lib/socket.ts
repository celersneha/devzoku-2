import type { Server } from "socket.io";

type SocketPayload =
  | string
  | number
  | boolean
  | null
  | { [key: string]: string | number | boolean | null | undefined };

let socketServer: Server | null = null;

export const setSocketServer = (io: Server) => {
  socketServer = io;
};

export const emitToUser = (
  userId: string,
  event: string,
  payload: SocketPayload,
) => {
  if (!socketServer) {
    return;
  }

  socketServer.to(userId).emit(event, payload);
};
