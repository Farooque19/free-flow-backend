import "reflect-metadata";
import { injectable, inject } from "inversify";
import { UserRepository } from "../repositories/UserRepository.js";
import { TYPES } from "../types/type.js";
import { isCorrectPasswordUtil } from "../utils/isCorrectPasswordUtil.js";
import { hashedPasswordUtil } from "../utils/hashedPasswordUtil.js";
import type { Role, User } from "@prisma/client";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const user: User | null = await this.userRepository.getUserDetails(email);
    if (!user) {
      return false;
    }
    return await isCorrectPasswordUtil(password, user.password);
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    role: Role
  ): Promise<void> {
    const hashedPassword: string = await hashedPasswordUtil(password);
    await this.userRepository.createUser(name, email, password, role);
  }

  async getUser(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }
    return await this.userRepository.getUserDetails(email);
  }

  async getUserById(id: number): Promise<User | null> {
    if (!id) {
      return null;
    }
    return await this.userRepository.getuserById(id);
  }
}
