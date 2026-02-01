/**
 * DTO for user profile response
 * Validates: Requirements 5.1
 */
export class UserProfileDto {
  id!: string;
  email!: string;
  displayName!: string;
  createdAt!: Date;
}
