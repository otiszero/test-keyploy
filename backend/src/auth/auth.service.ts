import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto';

/**
 * AuthService handles user authentication operations
 * Validates: Requirements 1.1, 1.2, 1.5, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 10.1, 10.2
 */
@Injectable()
export class AuthService {
  private readonly bcryptSaltRounds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.bcryptSaltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10'),
      10,
    );
  }

  /**
   * Register a new user
   * - Hash password with bcrypt (salt rounds from config, default 10)
   * - Check for duplicate email
   * - Create user in database
   *
   * Validates: Requirements 1.1, 1.2, 1.5, 10.1
   */
  async register(
    dto: RegisterDto,
  ): Promise<{ message: string; userId: string }> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password with bcrypt (salt rounds = 10 by default)
    // Validates: Requirements 1.5, 10.1
    const hashedPassword = await bcrypt.hash(
      dto.password,
      this.bcryptSaltRounds,
    );

    // Create user in database
    // Validates: Requirement 1.1
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        displayName: dto.displayName,
      },
    });

    return {
      message: 'Đăng ký thành công',
      userId: user.id,
    };
  }

  /**
   * Login user with email and password
   * - Verify credentials (email exists and password matches)
   * - Generate JWT token with 24h expiry
   *
   * Validates: Requirements 2.1, 2.2, 2.3, 10.2
   */
  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    // Find user by email
    // Validates: Requirement 2.2 - Reject login with non-existent email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    // Verify password
    // Validates: Requirement 2.3 - Reject login with wrong password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    // Generate JWT token with 24h expiry
    // Validates: Requirements 2.1, 10.2
    const payload = {
      sub: user.id,
      email: user.email,
      displayName: user.displayName,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * Request password reset
   * - Generate reset token using crypto.randomUUID()
   * - Save token to PasswordResetToken table with 1 hour expiry
   * - Return generic message regardless of whether email exists (security)
   * - Email sending is mocked for MVP
   *
   * Validates: Requirements 3.1, 3.2
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // If user exists, generate and save reset token
    // Validates: Requirement 3.1 - Generate reset token and send email instructions
    if (user) {
      // Generate reset token
      const resetToken = randomUUID();

      // Calculate expiry time (1 hour from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Save token to database
      await this.prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          expiresAt,
          userId: user.id,
        },
      });

      // Mock email sending for MVP
      // In production, this would send an actual email with the reset link
      console.log(
        `[MOCK EMAIL] Password reset link for ${dto.email}: /reset-password?token=${resetToken}`,
      );
    }

    // Validates: Requirement 3.2 - Return generic message regardless of whether email exists
    // This prevents email enumeration attacks
    return {
      message:
        'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu',
    };
  }

  /**
   * Reset password with valid token
   * - Verify token exists in database
   * - Verify token has not been used (single-use)
   * - Verify token has not expired (1 hour expiry)
   * - Hash new password with bcrypt
   * - Update user's password
   * - Mark token as used
   *
   * Validates: Requirements 3.3, 3.4, 3.5
   */
  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    // Find the reset token in database
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    // Validates: Requirement 3.3 - Token must exist
    if (!resetToken) {
      throw new BadRequestException('Token đặt lại mật khẩu không hợp lệ');
    }

    // Validates: Requirement 3.5 - Token must not have been used (single-use)
    if (resetToken.used) {
      throw new BadRequestException('Token đặt lại mật khẩu đã được sử dụng');
    }

    // Validates: Requirement 3.4 - Token must not have expired (1 hour expiry)
    const now = new Date();
    if (resetToken.expiresAt < now) {
      throw new BadRequestException('Token đặt lại mật khẩu đã hết hạn');
    }

    // Hash new password with bcrypt
    // Validates: Requirement 10.1 - Use bcrypt with salt rounds >= 10
    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      this.bcryptSaltRounds,
    );

    // Update user's password and mark token as used in a transaction
    // Validates: Requirements 3.3, 3.5
    await this.prisma.$transaction([
      // Update user's password
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      // Mark token as used (single-use)
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return {
      message: 'Mật khẩu đã được đặt lại thành công',
    };
  }

  /**
   * Change password for authenticated user
   * - Verify current password matches using bcrypt.compare
   * - Hash new password with bcrypt before saving
   *
   * Validates: Requirements 4.1, 4.2, 4.4
   */
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // Find user by ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Validates: Requirement 4.2 - Reject if current password is wrong
    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    // Validates: Requirement 4.4 - Hash new password before saving
    const hashedNewPassword = await bcrypt.hash(
      dto.newPassword,
      this.bcryptSaltRounds,
    );

    // Validates: Requirement 4.1 - Update password successfully
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return {
      message: 'Đổi mật khẩu thành công',
    };
  }
}
