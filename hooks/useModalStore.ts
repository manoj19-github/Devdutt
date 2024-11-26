import { Workspaces } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "editServer" | "invite";

interface ModalData {
  workspace?: Workspaces;
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
