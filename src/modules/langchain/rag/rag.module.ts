import { Module, DynamicModule, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RagService } from './rag.service';
import { JsonLoader } from './loaders/json.loader';
import { MemoryVectorStore } from './embeddings/vector-store/memory.store';
import { IVectorStore } from './interfaces/vector-store.interface';
import { IDataLoader } from './interfaces/loader.interface';
import { LangchainModule } from '../langchain.module';

interface JsonDataSourceConfig {
  path: string;
}

interface DataSource {
  type: 'json';
  config: JsonDataSourceConfig;
}

export interface RagModuleOptions {
  dataSources: DataSource[];
  vectorStore: {
    type: 'memory' | 'pgvector';
    config: Record<string, any>;
  };
}

@Module({
  imports: [forwardRef(() => LangchainModule)],
  providers: [
    {
      provide: 'DATA_LOADERS',
      useFactory: (options: RagModuleOptions) => {
        return options.dataSources.map((source) => {
          switch (source.type) {
            case 'json':
              return new JsonLoader(source.config);
            default:
              throw new Error(`Unsupported data source type: ${source.type}`);
          }
        });
      },
      inject: ['RAG_MODULE_OPTIONS'],
    },
    RagService,
  ],
  exports: [RagService],
})
export class RagModule {
  static forRoot(options: RagModuleOptions): DynamicModule {
    const vectorStoreProvider = {
      provide: 'VECTOR_STORE',
      useFactory: (): IVectorStore => {
        switch (options.vectorStore.type) {
          case 'memory':
            return new MemoryVectorStore();
          // case 'pgvector':
          //   return new PgVectorStore(options.vectorStore.config);
          default:
            throw new Error(
              `Unsupported vector store type: ${options.vectorStore.type}`,
            );
        }
      },
    };

    const dataLoadersProvider = {
      provide: 'DATA_LOADERS',
      useFactory: (): IDataLoader[] => {
        return options.dataSources.map((source) => {
          switch (source.type) {
            case 'json':
              return new JsonLoader(source.config);
            // case 'rds':
            //   return new RdsLoader(source.config);
            // case 'spreadsheet':
            //   return new SpreadsheetLoader(source.config);
            default:
              throw new Error(`Unsupported data source type: ${source.type}`);
          }
        });
      },
    };

    return {
      module: RagModule,
      imports: [ConfigModule],
      providers: [RagService, vectorStoreProvider, dataLoadersProvider],
      exports: [RagService],
    };
  }
}
