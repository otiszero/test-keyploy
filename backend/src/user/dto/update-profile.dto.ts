import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for updating user profile
 * Validates: Requirements 5.2, 5.3
 */
export class UpdateProfileDto {
  @IsString({ message: 'Tên hiển thị phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên hiển thị không được để trống' })
  displayName!: string;
}
