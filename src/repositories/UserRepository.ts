import "reflect-metadata";
import { injectable } from "inversify";
import { prisma } from "../utils/prismaUtil.js";
import type { Role } from "@prisma/client";
import type { User } from "@prisma/client";

@injectable()
export class UserRepository {
  private prisma = prisma;
  async getUserDetails(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(name: string, email: string, password: string, role: Role) {
    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
  }
}
