import { describe, it, expect, beforeEach } from 'vitest';
import { generateAccessToken, verifyAccessToken, JWTPayload } from '../lib/jwt';

describe('JWT Utilities', () => {
  const payload: JWTPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    role: 'USER',
  };

  beforeEach(() => {
    // Set test JWT secrets
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
  });

  it('should generate and verify access token', () => {
    const token = generateAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('should throw error for invalid token', () => {
    expect(() => {
      verifyAccessToken('invalid-token');
    }).toThrow();
  });
});

