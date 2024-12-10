import { UserWithWorkspaces, WorkspaceWithMembersWithProfiles } from "@/types";
import { Channel, ChannelType, Workspaces } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createWorkspace"
  | "editWorkspace"
  | "invite"
  | "members"
  | "createChannel"
  | "leaveWorkspace"
  | "deleteWorkspace"
  | "deleteChannel"
  | "editChannel"
  | "messageFile";

interface ModalData {
  workspace?: WorkspaceWithMembersWithProfiles | null;
  currUser?: UserWithWorkspaces | null;
  channelType?: ChannelType | null;
  channel?: Channel | null;
  apiUrl?: string;
  query?: Record<string, any>;
  loggedInUserDetails?: any;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type: ModalType, data = {}) =>
    set(() => ({ type, isOpen: true, data })),
  onClose: () => set(() => ({ isOpen: false })),
}));
