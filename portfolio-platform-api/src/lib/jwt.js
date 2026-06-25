import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";

if (!SECRET) {
  throw new Error("JWT_SECRET is not set. Add it to .env");
}

export function signAuthToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, SECRET);
}
