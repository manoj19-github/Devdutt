import { create } from "zustand";

export type AppLoaderState = {
  loading: boolean;
  message: string;
  startLoader: ({
    loader,
    message,
  }: {
    loader: boolean;
    message: string;
  }) => void;
  stopLoader: () => void;
};

export const useAPPLoader = create<AppLoaderState>((set) => ({
  loading: false,
  message: "Loading Please wait ...",
  startLoader: ({ loader, message }) =>
    set((state) => ({ loading: loader, message: message })),
  stopLoader: () => set((state) => ({ loading: false, message: "" })),
}));
