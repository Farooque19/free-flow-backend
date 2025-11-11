import "reflect-metadata";
import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaUtil.js";
import type { Context } from "koa";
import type { SignUpFormat } from "../interface/interfaces.js";
import { salt } from "../config/jwtConfig.js";

@injectable()
export class AuthController {
  async register(ctx: Context) {
    const { name, email, password, role } = ctx.request.body as SignUpFormat;
    if (!name || !email || !password || !role) {
      ctx.status = 400;
      ctx.body = "Missing fields";
      return;
    }

    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (exists) {
      ctx.status = 400;
      ctx.body = "Email already exists. Please enter a new one or login.";
      return;
    }

    const hashedPassword: string = await bcrypt.hash(password, salt);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    ctx.body = { message: "User registered", user: { id: newUser.id, email } };
  }

  async login(ctx: Context) {
    const { email, password } = ctx.request.body as {
      email: string;
      password: string;
    };
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      ctx.status = 400;
      ctx.body = "User does not exist. Please register.";
      return;
    }

    const valid: boolean = await bcrypt.compare(password, user.password);

    if (!valid) {
      ctx.status = 400;
      ctx.body = "Wrong Password. Please enter the correct password.";
      return;
    }

    const token = Jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    ctx.body = { message: "Login successful", token };
  }
}
