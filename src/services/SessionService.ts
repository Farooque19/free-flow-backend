import "reflect-metadata";
import { inject, injectable } from "inversify";
import { SessionRepository } from "../repositories/SessionRepository.js";
import { TYPES } from "../types/type.js";
import type { Session } from "@prisma/client";

@injectable()
export class SessionServices {
  constructor(
    @inject(TYPES.SessionRepository)
    private sessionRepository: SessionRepository
  ) {}

  async createSession(refreshToken: string, userId: number): Promise<void> {
    await this.sessionRepository.createSession(refreshToken, userId);
  }

  async getSessionByToken(refreshToken: string): Promise<Session | null> {
    return await this.sessionRepository.getSessionByToken(refreshToken);
  }

  async getSessionsByUserId(userId: number): Promise<Session[] | null> {
    return await this.sessionRepository.getSessionById(userId);
  }

  async deleteSession(userId: number): Promise<void> {
    await this.sessionRepository.deleteSessions(userId);
  }
}
