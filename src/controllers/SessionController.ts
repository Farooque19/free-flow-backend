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
}
