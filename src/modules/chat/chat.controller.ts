import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SkipAuth } from '../../common/decorators';
import { ChatMessageDto, ChatResponseDto } from './dto/chat-message.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @SkipAuth()
  @Post('message')
  @ApiOperation({
    summary: 'AI와 대화하기',
    description:
      '사용자의 메시지를 받아 AI의 응답을 반환합니다. 이전 대화 맥락을 유지합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'AI의 응답 메시지',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (메시지가 비어있거나 너무 긴 경우)',
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류 (AI 응답 생성 실패)',
  })
  async sendMessage(
    @Body() chatMessageDto: ChatMessageDto,
  ): Promise<ChatResponseDto> {
    const response = await this.chatService.sendMessage(chatMessageDto.message);
    return { response };
  }

  @SkipAuth()
  @Get('history')
  @ApiOperation({
    summary: '대화 기록 조회',
    description: '현재까지의 대화 기록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '대화 기록 목록',
    schema: {
      type: 'object',
      properties: {
        history: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['human', 'ai'] },
              content: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async getHistory() {
    const history = await this.chatService.getHistory();
    return { history };
  }

  @SkipAuth()
  @Delete('history')
  @ApiOperation({
    summary: '대화 기록 초기화',
    description: '모든 대화 기록을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '대화 기록이 성공적으로 삭제됨',
  })
  async clearHistory() {
    await this.chatService.clearHistory();
    return { message: '대화 기록이 삭제되었습니다.' };
  }
}
