import bcrypt from 'bcrypt';

export const isCorrectPasswordUtil = async (password: string, userPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, userPassword);
}