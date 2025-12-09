import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { generateAccessToken, generateRefreshToken, JWTPayload } from './jwt';
import { Role } from '@prisma/client';

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    phone: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<AuthResult> {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user (default role: USER)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      role: Role.USER,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
    },
  });

  // Generate tokens
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user,
    accessToken,
    refreshToken,
  };
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<AuthResult> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const jwtModule = await import('./jwt');

  // Verify refresh token
  const payload = jwtModule.verifyRefreshToken(refreshToken);

  // Verify user still exists
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Generate new tokens
  const newPayload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = jwtModule.generateAccessToken(newPayload);
  const newRefreshToken = jwtModule.generateRefreshToken(newPayload);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

