import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime";

declare global {
  var prisma: PrismaClient | undefined;
}

// export const dbConfig = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalThis.prisma = dbConfig;

let dbConfig: PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined,
  DefaultArgs
>;

if (typeof window === "undefined" || !window) {
  if (process.env.NODE_ENV === "production") {
    dbConfig = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }

    dbConfig = global.prisma;
  }
}

export { dbConfig };
