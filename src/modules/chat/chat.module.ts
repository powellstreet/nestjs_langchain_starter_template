import { Module, forwardRef } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LangchainModule } from '../langchain/langchain.module';

@Module({
  imports: [forwardRef(() => LangchainModule)],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
