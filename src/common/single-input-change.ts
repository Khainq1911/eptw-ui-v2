import { type SetStateAction } from "react";
import type React from "react";

export const handleChangeInput = <T>(
  e: React.ChangeEvent<HTMLInputElement>,
  action: React.Dispatch<SetStateAction<T>>
) => {
  const { name, value } = e.target;
  action((prev) => ({ ...prev, [name]: value }));
};
