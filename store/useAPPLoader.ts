import { create } from "zustand";

export type AppLoaderState = {
  loading: boolean;
  message: string;
  startLoader: (message?: string) => void;
  stopLoader: () => void;
};

export const useAPPLoader = create<AppLoaderState>((set) => ({
  loading: false,
  message: "Loading Please wait ...",
  startLoader: (message) =>
    set((state) => ({
      loading: true,
      message: message ?? "Loading Please wait ...",
    })),
  stopLoader: () => set((state) => ({ loading: false, message: "" })),
}));
