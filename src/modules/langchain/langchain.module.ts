import { Module } from '@nestjs/common';
import { ChatChain } from './chains/chat.chain';
import { ChatPrompt } from './prompts/chat.prompt';

@Module({
  providers: [
    {
      provide: 'LANGCHAIN_CONFIG',
      useValue: {
        // 환경 변수에서 가져올 설정들
        modelName: 'gpt-3.5-turbo', // 기본값
      },
    },
    ChatChain,
    ChatPrompt,
  ],
  exports: [ChatChain, ChatPrompt],
})
export class LangchainModule {}
