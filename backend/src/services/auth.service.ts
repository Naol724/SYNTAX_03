/**
 * Auth Service
 * Business logic for admin login, logout, token management, and user registration.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { adminRepository } from '../repositories/admin.repository';
import { userRepository } from '../repositories/user.repository';
import { refreshTokenRepository } from '../repositories/refresh-token.repository';
import config from '../config/environment';
import {
  InvalidCredentialsError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from '../utils/errors';
import { hashToken, expiryToSeconds, addSeconds } from '../utils/helpers';
import {
  Admin,
  User,
  SafeAdmin,
  AuthResponse,
  LoginCredentials,
  CreateUserDTO,
  AuthPayload,
} from '../types';

const SALT_ROUNDS = 12;

export class AuthService {
  // =====================================================
  // ADMIN LOGIN
  // =====================================================
  async adminLogin(
    credentials: LoginCredentials,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthResponse> {
    const admin = await adminRepository.findByEmail(credentials.email);
    if (!admin) throw new InvalidCredentialsError();

    const passwordValid = await bcrypt.compare(credentials.password, admin.password_hash);
    if (!passwordValid) throw new InvalidCredentialsError();

    // Update last login timestamp
    await adminRepository.updateLastLogin(admin.admin_id);

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokenPair(
      admin,
      userAgent,
      ipAddress
    );

    return {
      admin: this.sanitizeAdmin(admin),
      accessToken,
      refreshToken,
      expiresIn: expiryToSeconds(config.jwt.expiry),
    };
  }

  // =====================================================
  // ADMIN LOGOUT
  // =====================================================
  async adminLogout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await refreshTokenRepository.revokeByHash(tokenHash);
  }

  async adminLogoutAll(admin_id: string): Promise<void> {
    await refreshTokenRepository.revokeAllForAdmin(admin_id);
  }

  // =====================================================
  // REFRESH ACCESS TOKEN
  // =====================================================
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    const tokenHash = hashToken(refreshToken);
    const storedToken = await refreshTokenRepository.findByHash(tokenHash);

    if (!storedToken) throw new UnauthorizedError('Invalid or expired refresh token');

    const admin = await adminRepository.findById(storedToken.admin_id);
    if (!admin || !admin.is_active) throw new UnauthorizedError('Admin account inactive');

    const accessToken = this.generateAccessToken(admin);

    return {
      accessToken,
      expiresIn: expiryToSeconds(config.jwt.expiry),
    };
  }

  // =====================================================
  // USER REGISTRATION
  // =====================================================
  async registerUser(dto: CreateUserDTO): Promise<User> {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('An account with this email already exists');

    return userRepository.create(dto);
  }

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================
  async changePassword(
    admin_id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const admin = await adminRepository.findById(admin_id);
    if (!admin) throw new NotFoundError('Admin');

    const valid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!valid) throw new InvalidCredentialsError();

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await adminRepository.updatePassword(admin_id, newHash);

    // Revoke all refresh tokens to force re-login
    await refreshTokenRepository.revokeAllForAdmin(admin_id);
  }

  // =====================================================
  // PRIVATE HELPERS
  // =====================================================
  private generateAccessToken(admin: Admin): string {
    const payload: Omit<AuthPayload, 'iat' | 'exp'> = {
      admin_id: admin.admin_id,
      email: admin.email,
      username: admin.username,
      role: admin.role as 'admin' | 'super_admin',
    };
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    } as jwt.SignOptions);
  }

  private async generateTokenPair(
    admin: Admin,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.generateAccessToken(admin);

    // Generate a raw refresh token, store its hash
    const rawRefreshToken = uuidv4();
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = addSeconds(new Date(), expiryToSeconds(config.jwt.refreshExpiry));

    await refreshTokenRepository.create({
      admin_id: admin.admin_id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      user_agent: userAgent,
      ip_address: ipAddress,
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private sanitizeAdmin(admin: Admin): SafeAdmin {
    const { password_hash, ...safe } = admin;
    return safe;
  }
}

export const authService = new AuthService();
