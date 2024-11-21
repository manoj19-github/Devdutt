import * as zod from "zod";

export const CreateServerformSchema = zod.object({
  name: zod
    .string()
    .min(1, { message: "Name is required" })
    .max(80, { message: "Maximum 80 characters are allowed" }),
  imageUrl: zod
    .string()
    .url({ message: "Invalid URL" })
    .min(1, { message: "Image URL is required" })
    .max(255, { message: "Maximum 255 characters are allowed" }),
});
