import * as zod from "zod";

export const CreateServerformSchema = zod.object({
  name: zod
    .string()
    .min(1, { message: "Name is required" })
    .max(80, { message: "Maximum 80 characters are allowed" }),
  imageUrl: zod.string().optional(),
});
