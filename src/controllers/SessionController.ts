import "reflect-metadata";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import { accessTokenExpiry, jwtSecret } from "../config/jwtConfig.js";
import { generateToken } from "../utils/tokenUtil.js";
import { TYPES } from "../types/type.js";
import { SessionServices } from "../services/SessionService.js";
import type { Context } from "koa";
import {
  FORBIDDEN_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
  UNAUTHORIZED_STATUS,
} from "../constants/constants.js";
import type { Session } from "@prisma/client";

@injectable()
export class SessionController {
  constructor(
    @inject(TYPES.SessionServices) private sessionService: SessionServices
  ) {}

  async getAccessToken(ctx: Context): Promise<void> {
    try {
      const { token } = ctx.request.body as { token: string };

      if (!token) {
        ctx.status = UNAUTHORIZED_STATUS;
        ctx.body = "No token provided.";
        return;
      }

      const currentSession: Session | null =
        await this.sessionService.getSessionByToken(token);

      if (!currentSession) {
        ctx.status = FORBIDDEN_STATUS;
        ctx.body = "Session expired. Please login again.";
        return;
      }

      jwt.verify(token, jwtSecret, (err: any, payload: any) => {
        if (err) {
          ctx.status = FORBIDDEN_STATUS;
          ctx.body = { error: err };
          return;
        }
        const { exp, iat, ...payloadWithoutExpAndIat } = payload;
        const accessToken: string = generateToken(
          payloadWithoutExpAndIat,
          jwtSecret,
          accessTokenExpiry
        );

        ctx.body = { accessToken };
      });
    } catch (err) {
      ctx.body = "Something went wrong. Please try again later.";
      ctx.status = INTERNAL_SERVER_ERROR_STATUS;
    }
  }
}
