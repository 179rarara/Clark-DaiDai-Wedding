import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user?: AuthenticatedUser): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const sampleUser: AuthenticatedUser = {
  id: 7,
  openId: "guestbook-user",
  email: "guest@example.com",
  name: "Sample Guest",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("guestbook", () => {
  it("requires authentication to read the private wall", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.guestbook.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects an empty one-line note before touching the database", async () => {
    const caller = appRouter.createCaller(createContext(sampleUser));
    await expect(caller.guestbook.create({ place: "hong-kong", guestNote: "   " })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("accepts the supported place values at the input boundary", async () => {
    const caller = appRouter.createCaller(createContext(sampleUser));
    await expect(caller.guestbook.create({ place: "not-a-place" as "hong-kong", guestNote: "A lovely day" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
