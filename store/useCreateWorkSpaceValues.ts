import { create } from "zustand";

export type createWorkSpaceValues = {
  name: string;
  imageUrl: string;
  updateImageUrl: (image: string) => void;
  updateName: (name: string) => void;
  updateValues: (values: Partial<createWorkSpaceValues>) => void;
  currStep: number;
  setCurrStep: (step: number) => void;
};

export const useCreateWorkSpaceValues = create<createWorkSpaceValues>(
  (set) => ({
    name: "",
    imageUrl: "",
    currStep: 1,
    updateName: (name: string) => set((state) => ({ ...state, name })),
    setCurrStep: (step: number) =>
      set((state) => ({ ...state, currStep: step })),
    updateValues: (values: Partial<createWorkSpaceValues>) =>
      set((state) => ({ ...state, ...values })),
    updateImageUrl: (image: string) =>
      set((state) => ({ ...state, imageUrl: image })),
  })
);
