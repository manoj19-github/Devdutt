import { Workspaces, Member, User } from "@prisma/client";

export type WorkspaceWithMembersWithProfiles = Workspaces & {
  members: (Member & { user: User })[];
};


export type UserWithWorkspaces = User & {
  workspaces: Array<Workspaces>;
};