import jwt, { type SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function generateVerificationToken(): string {
  return jwt.sign({ type: 'verification' }, JWT_SECRET, { expiresIn: '24h' });
}

export function generateResetToken(userId: string): string {
  return jwt.sign({ userId, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
}
