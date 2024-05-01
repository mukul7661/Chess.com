import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'proper';

export const extractUserId = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  return decoded.userId;
};
