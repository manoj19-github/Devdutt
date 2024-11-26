import { Workspaces, Member, User } from "@prisma/client";

export type WorkspaceWithMembersWithProfiles = Workspaces & {
  members: (Member & { user: User })[];
};
