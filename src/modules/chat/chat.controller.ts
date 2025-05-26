import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SkipAuth } from '../../common/decorators';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @SkipAuth()
  @Post('message')
  async sendMessage(@Body() body: { message: string }) {
    return await this.chatService.sendMessage(body.message);
  }
}
