import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({
    description: '사용자가 보내는 메시지',
    example: 'Hello, how are you?',
    maxLength: 1000,
  })
  @IsNotEmpty({ message: '메시지는 비어있을 수 없습니다.' })
  @IsString({ message: '메시지는 문자열이어야 합니다.' })
  @MaxLength(1000, { message: '메시지는 1000자를 초과할 수 없습니다.' })
  message: string;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'AI의 응답 메시지',
    example: 'Hello! I am an AI assistant. How can I help you today?',
  })
  response: string;
}
