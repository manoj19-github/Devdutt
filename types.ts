import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
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
