export const salt = 10;
export const jwtSecret = process.env.JWT_SECRET as string;
export const accessTokenExpiry: any = '1m';
export const refreshTokenExpiry: any = '1d';