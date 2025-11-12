import jwt from "jsonwebtoken";

export function generateToken(payload: {email: string, id: number}, secret: string, tokenExpiry: any): string {
    return jwt.sign(payload, secret, {expiresIn: `${tokenExpiry}`});
}