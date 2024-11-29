import { type ClassValue, clsx } from "clsx"
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatVal = (value: any) => {
  if (value === undefined || value === null) return "";
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (value.length > 1) return value.replace(/s+/g, "-").toLowerCase();
  return value;
};

export const generateUniqueUUID = (currentCodes: Array<string>): any => {
  const newCode = uuid();
  if (currentCodes.includes(newCode)) {
    return generateUniqueUUID(currentCodes);
  }

  return newCode;
};