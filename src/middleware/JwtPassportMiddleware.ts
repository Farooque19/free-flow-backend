import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/type.js";
import passport from "koa-passport";
import { jwtSecret } from "../config/jwtConfig.js";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import type { VerifiedCallback } from "passport-jwt";
import { SessionServices } from "../services/SessionService.js";
import { UserService } from "../services/UserService.js";
import type { Session, User } from "@prisma/client";

@injectable()
export class JwtPassportMiddleware {
  constructor(
    @inject(TYPES.SessionServices)
    private readonly sessionService: SessionServices,
    @inject(TYPES.UserService) private readonly userService: UserService
  ) {}

  init() {
    const opts: any = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = jwtSecret;

    passport.use(
      new JWTStrategy(opts, async (payload: any, done: VerifiedCallback) => {
        try {
          const id: number = Number(payload.id);
          const user: User | null = await this.userService.getUserById(id);
          const currentSession: Session[] | null =
            await this.sessionService.getSessionsByUserId(id);
          if (currentSession?.length === 0 || !user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      })
    );
  }
}
