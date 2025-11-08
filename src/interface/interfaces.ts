import { Role } from "../generated/prisma/enums.js";

export interface SignUpFormat {
  name: String;
  email: String;
  password: String;
  role: Role;
}
