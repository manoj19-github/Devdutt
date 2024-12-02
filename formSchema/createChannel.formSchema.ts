import { ChannelType } from "@prisma/client";
import * as zod from "zod";

export const CreateChannelFormSchema = zod.object({
  name: zod
    .string()
    .min(1, { message: "Name is required" })
    .max(80, { message: "Maximum 80 characters are allowed" })
    .refine((name) => name !== "general", {}),
  type: zod.nativeEnum(ChannelType),
});
