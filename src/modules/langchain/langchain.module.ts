import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatChain } from './chains/chat.chain';
import { ChatPrompt } from './prompts/chat.prompt';
import { ChatMemory } from './memory/chat.memory';
import { RagModule } from './rag/rag.module';
import { RagService } from './rag/rag.service';
import { MemoryVectorStore } from './rag/embeddings/vector-store/memory.store';
import { JsonLoader } from './rag/loaders/json.loader';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() =>
      RagModule.forRoot({
        dataSources: [
          {
            type: 'json',
            config: {
              path: 'src/modules/langchain/knowledge/json/convenience_store_products.json',
            },
          },
        ],
        vectorStore: {
          type: 'memory',
          config: {},
        },
      }),
    ),
  ],
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
    {
      provide: 'VECTOR_STORE',
      useClass: MemoryVectorStore,
    },
    {
      provide: 'DATA_LOADERS',
      useFactory: () => [
        new JsonLoader({
          path: 'src/modules/langchain/knowledge/json/convenience_store_products.json',
        }),
      ],
    },
    ChatChain,
    ChatPrompt,
    ChatMemory,
    RagService,
  ],
  exports: [ChatChain],
})
export class LangchainModule {}
