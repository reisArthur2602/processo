import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { env } from "@/lib/env";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export const generateToken = async (userId: string): Promise<string> => {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
};

export const verifyToken = async (token: string) => {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { userId: string };
  } catch {
    return null;
  }
};

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 12);

export const comparePassword = (
  password: string,
  hash: string,
): Promise<boolean> => bcrypt.compare(password, hash);
