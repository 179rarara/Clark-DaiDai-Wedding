import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createGuestMessage, listGuestMessages } from "./db";

const placeSchema = z.enum(["general", "hong-kong", "tianjin", "california"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  guestbook: router({
    list: protectedProcedure.query(() => listGuestMessages()),
    create: protectedProcedure
      .input(z.object({
        place: placeSchema.default("general"),
        guestNote: z.string().trim().min(1, "請寫下一句話").max(280, "一句話最多 280 字"),
        message: z.string().trim().max(2000, "留言最多 2000 字").optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const created = await createGuestMessage({
          authorId: ctx.user.id,
          authorName: ctx.user.name?.trim() || "一位親友",
          place: input.place,
          guestNote: input.guestNote,
          message: input.message || null,
        });
        if (!created) throw new Error("留言暫時無法儲存，請稍後再試");
        return created;
      }),
  }),
});

export type AppRouter = typeof appRouter;
