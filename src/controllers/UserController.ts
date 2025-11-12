import "reflect-metadata";
import { injectable, inject } from "inversify";
import type { Context } from "koa";
import { UserService } from "../services/UserService.js";
import type { SignUpFormat } from "../interface/interfaces.js";
import {
  BAD_REQUEST_STATUS,
  CONFLICT_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
  OK_STATUS,
} from "../constants/constants.js";
import type { Session, User } from "@prisma/client";
import { SessionServices } from "../services/SessionService.js";
import { jwtDecode } from "jwt-decode";
import { TYPES } from "../types/type.js";
import {
  accessTokenExpiry,
  jwtSecret,
  refreshTokenExpiry,
} from "../config/jwtConfig.js";
import { generateToken } from "../utils/tokenUtil.js";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.SessionServices) private sessionService: SessionServices
  ) {}

  async register(ctx: Context) {
    try {
      const { name, email, password, role } = ctx.request.body as SignUpFormat;
      if (!name || !email || !password || !role) {
        ctx.status = BAD_REQUEST_STATUS;
        ctx.body = "Missing required fields.";
        return;
      }

      const user: User | null = await this.userService.getUser(email);

      if (user) {
        ctx.body =
          "User already exists. Please try with different credentials.";
        ctx.status = CONFLICT_STATUS;
        return;
      }

      await this.userService.createUser(name, email, password, role);
      ctx.status = OK_STATUS;
      ctx.body = "User created successfully.";
    } catch (error) {
      ctx.status = INTERNAL_SERVER_ERROR_STATUS;
      ctx.body = "Something went wrong. PLease try agin later.";
    }
  }

  async login(ctx: Context) {
    try {
      const { email, password } = ctx.request.body as {
        email: string;
        password: string;
      };
      if (!email || !password) {
        ctx.body = "Username and password are both required.";
        ctx.status = BAD_REQUEST_STATUS;
        return;
      }
      const user: User | null = await this.userService.getUser(email);

      if (!user) {
        ctx.body =
          "User with given email id does not exists. Please sign up/register";
        ctx.status = NOT_FOUND_STATUS;
        return;
      }

      const isPasswordValid: boolean = await this.userService.validateUser(
        email,
        password
      );

      if (!isPasswordValid) {
        ctx.status = BAD_REQUEST_STATUS;
        ctx.body = "Incorrect password. Please type the correct password.";
      }

      const payload = { email: user.email, id: user.id };

      const accessToken: string = generateToken(
        payload,
        jwtSecret,
        accessTokenExpiry
      );
      const refreshToken: string = generateToken(
        payload,
        jwtSecret,
        refreshTokenExpiry
      );

      const currentSession: Session | null =
        await this.sessionService.getSessionByToken(refreshToken);

      if (currentSession) {
        return ctx.redirect("/");
      }

      await this.sessionService.createSession(refreshToken, user.id);
      ctx.status = OK_STATUS;
      ctx.body = { accessToken, refreshToken };
    } catch (error) {
      ctx.body = "Something went wrong. Please try again later.";
      ctx.status = INTERNAL_SERVER_ERROR_STATUS;
    }
  }

  async logOut(ctx: Context): Promise<void> {
    try {
      const { token } = ctx.request.body as { token: string };

      if (!token) {
        ctx.status = BAD_REQUEST_STATUS;
        ctx.body = "Refresh token is required.";
        return;
      }

      const decoded: any = jwtDecode(token);

      await this.sessionService.deleteSession(decoded.id);
      ctx.status = OK_STATUS;
      ctx.body = "Logged out successfully.";
    } catch (error) {
      ctx.status = INTERNAL_SERVER_ERROR_STATUS;
      ctx.body = "Something went wrong. Please try again later.";
    }
  }
}
