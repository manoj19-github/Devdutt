import { Server as NetServer, Socket } from "net";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";
import { Workspaces, Member, User } from "@prisma/client";
import { Server as SocketIOSerever } from "socket.io";
export type WorkspaceWithMembersWithProfiles = Workspaces & {
  members: (Member & { user: User })[];
};

export type UserWithWorkspaces = User & {
  workspaces: Array<Workspaces>;
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOSerever;
    };
  };
};

export interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

export interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}