import { createContext, type Dispatch, type SetStateAction } from "react";

export const ModalContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>] | undefined
>(undefined);
