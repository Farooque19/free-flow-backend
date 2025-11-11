import jwt from "jsonwebtoken";

export function generateToken(payload: {username: string, id: number}, secret: string, tokenExpiry: any): string {
    return jwt.sign(payload, secret, {expiresIn: `${tokenExpiry}`});
}