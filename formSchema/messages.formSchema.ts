import * as Z from "zod"

export const messageFormSchema = Z.object({
    content:Z.string().min(1)
})