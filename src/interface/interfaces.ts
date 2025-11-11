import { Role } from "@prisma/client";

export interface SignUpFormat {
  name: string;
  email: string;
  password: string;
  role: Role;
}
