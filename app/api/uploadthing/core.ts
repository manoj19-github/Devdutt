import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "../../../app/_config/auth.config";

const uploadingHandler = createUploadthing();
const handleAuth = async (): Promise<any> => {
  const session = await auth();
  if (!session || !session.user) throw new Error("Not authenticated");
  return session.user.id;
};

export const ourFileRouter = {
  serverImage: uploadingHandler({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: uploadingHandler([
    "image",
    "video",
    "audio",
    "pdf",
    "text",
    "blob",
  ])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter; // satisfies is used to tell TypeScript that our object conforms to the FileRouter interface
export type OurFileRouter = typeof ourFileRouter;
