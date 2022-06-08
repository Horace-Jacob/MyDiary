import { Request, Response } from "express";
import { Session } from "express-session";
import Redis from "ioredis";

declare module "express-session" {
  interface Session {
    userId: number;
  }
}

export type Context = {
  req: Request & { session: Session };
  res: Response;
  redis: Redis;
};
