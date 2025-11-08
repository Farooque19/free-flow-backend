import { injectable } from "inversify";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import prisma from "../utils/prismaUtil.js";
import type { Context } from "koa";
import type { SignUpFormat } from "../interface/interfaces.js";

@injectable()
class AuthController {
  async register(ctx: Context) {
    const { name, email, password, role } = ctx.request.body as SignUpFormat;
    if(!name || !email || !password || !role){
        ctx.status = 400;
        ctx.body = "Missing fields";
        return;
    }

    const exists = await prisma.user.find
  }
}
