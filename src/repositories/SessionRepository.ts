import "reflect-metadata";
import { prisma } from "../utils/prismaUtil.js";
import { injectable } from "inversify";
import type { Session } from "@prisma/client";

@injectable()
export class SessionRepository {
  private prisma = prisma;

  async createSession(refreshtoken: string, id: number): Promise<void> {
    await this.prisma.session.create({
      data: {
        token: refreshtoken,
        userId: id,
      },
    });
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: {
        token,
      },
    });
  }

  async getSessionById(userId: number): Promise<Session[] | null> {
    return this.prisma.session.findMany({
      where: {
        userId,
      },
    });
  }

  async deleteSessions(id: number): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        userId: id,
      },
    });
  }
}
