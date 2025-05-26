import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatChain } from './chains/chat.chain';
import { ChatPrompt } from './prompts/chat.prompt';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'LANGCHAIN_CONFIG',
      useFactory: (configService: ConfigService) => ({
        openaiApiKey: configService.get<string>('OPENAI_API_KEY'),
        modelName: configService.get<string>(
          'OPENAI_MODEL_NAME',
          'gpt-3.5-turbo',
        ),
      }),
      inject: [ConfigService],
    },
    ChatChain,
    ChatPrompt,
  ],
  exports: [ChatChain, ChatPrompt],
})
export class LangchainModule {}
