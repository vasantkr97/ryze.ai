import { nanoid } from 'nanoid';
import { prisma } from '@/db/client.js';
import { hashPassword, comparePassword } from '@/lib/utils/hash.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from '@/lib/utils/jwt.js';
import { AppError } from '@/middleware/error-handler.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
  };
  tokens: AuthTokens;
}

export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const { email, password, name } = input;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('USER_EXISTS', 'A user with this email already exists', 409);
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
    },
  });

  // Generate tokens
  const tokens = await generateTokens(user.id, user.email);

  // Create default workspace for user
  const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${nanoid(6)}`;
  await prisma.workspace.create({
    data: {
      name: `${name}'s Workspace`,
      slug,
      members: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
    },
  });

  return { user, tokens };
};

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  // Generate tokens
  const tokens = await generateTokens(user.id, user.email);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    },
    tokens,
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!storedToken || storedToken.token !== refreshToken) {
      throw new AppError('INVALID_TOKEN', 'Invalid refresh token', 401);
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new AppError('TOKEN_EXPIRED', 'Refresh token has expired', 401);
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new tokens
    return generateTokens(storedToken.user.id, storedToken.user.email);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('INVALID_TOKEN', 'Invalid refresh token', 401);
  }
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    await prisma.refreshToken.delete({ where: { id: payload.tokenId } });
  } catch {
    // Ignore errors - token might already be invalid
  }
};

export const logoutAllDevices = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

const generateTokens = async (userId: string, email: string): Promise<AuthTokens> => {
  const tokenPayload: TokenPayload = { userId, email };

  // Create refresh token record
  const refreshTokenRecord = await prisma.refreshToken.create({
    data: {
      token: nanoid(64),
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({
    userId,
    tokenId: refreshTokenRecord.id,
  });

  // Update the record with the actual JWT
  await prisma.refreshToken.update({
    where: { id: refreshTokenRecord.id },
    data: { token: refreshToken },
  });

  return { accessToken, refreshToken };
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      emailVerified: true,
      createdAt: true,
    },
  });
};
