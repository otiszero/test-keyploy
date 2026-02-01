import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString({ message: 'Nội dung tin nhắn phải là chuỗi' })
  @IsNotEmpty({ message: 'Nội dung tin nhắn không được để trống' })
  @MinLength(1, { message: 'Nội dung tin nhắn phải có ít nhất 1 ký tự' })
  @MaxLength(1000, { message: 'Nội dung tin nhắn không được vượt quá 1000 ký tự' })
  content!: string;
}
