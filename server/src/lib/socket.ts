import type { Server } from "socket.io";

let socketServer: Server | null = null;

export const setSocketServer = (io: Server) => {
  socketServer = io;
};

export const emitToUser = (userId: string, event: string, payload: unknown) => {
  if (!socketServer) {
    return;
  }

  socketServer.to(userId).emit(event, payload);
};
