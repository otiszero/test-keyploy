import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import type { RequestUser } from '../auth/strategies';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import type { UserProfileDto } from './dto/user-profile.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: { user: RequestUser }): Promise<UserProfileDto> {
    return this.userService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @Request() req: { user: RequestUser },
  ): Promise<UserProfileDto> {
    return this.userService.updateProfile(req.user.id, dto);
  }
}
