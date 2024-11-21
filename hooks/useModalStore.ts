import { create } from "zustand";

export type ModalType = "createServer" | "editServer";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType) => set(() => ({ type, isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
}));
