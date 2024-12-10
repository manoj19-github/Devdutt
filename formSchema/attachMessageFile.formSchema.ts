import * as zod from "zod";

export const attachMessageFileFormSchema = zod.object({
  imageUrl: zod.string(),
});
