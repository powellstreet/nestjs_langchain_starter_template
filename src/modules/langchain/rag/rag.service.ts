import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { IDataLoader } from './interfaces/loader.interface';
import { IVectorStore } from './interfaces/vector-store.interface';
import { IDocument } from './interfaces/document.interface';
import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RagService implements OnModuleInit {
  private model: ChatOpenAI;
  private readonly logger = new Logger(RagService.name);

  constructor(
    @Inject('VECTOR_STORE')
    private readonly vectorStore: IVectorStore,
    @Inject('DATA_LOADERS')
    private readonly loaders: IDataLoader[],
    private readonly configService: ConfigService,
  ) {
    this.model = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: this.configService.get<string>(
        'OPENAI_MODEL_NAME',
        'gpt-3.5-turbo',
      ),
      temperature: 0.7,
    });
  }

  async onModuleInit() {
    await this.initialize();
  }

  async initialize(): Promise<void> {
    try {
      this.logger.log('Initializing RAG data sources...');
      await this.initializeDataSources();
      this.logger.log('RAG data sources initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize RAG data sources:', error);
      throw error;
    }
  }

  private async initializeDataSources(): Promise<void> {
    console.log(`Found ${this.loaders.length} data loaders`);
    for (const loader of this.loaders) {
      await this.initializeDataSource(loader);
    }
  }

  async initializeDataSource(loader: IDataLoader): Promise<void> {
    console.log('Validating data source...');
    const isValid = await loader.validate();
    if (!isValid) {
      throw new Error('Invalid data source');
    }
    console.log('Data source validation successful');

    console.log('Loading documents...');
    const documents = await loader.load();
    console.log(`Loaded ${documents.length} documents`);

    console.log('Adding documents to vector store...');
    await this.vectorStore.addDocuments(documents);
    console.log('Documents embedded and stored successfully');
  }

  async query(
    question: string,
    options: {
      k?: number;
      filter?: Record<string, any>;
    } = {},
  ): Promise<{
    answer: string;
    sources: IDocument[];
  }> {
    try {
      const documents = await this.vectorStore.similaritySearch(
        question,
        options.k || 3,
      );

      const prompt = this.createPrompt(question, documents);
      const response = await this.model.invoke(prompt);

      const answer =
        typeof response.content === 'string'
          ? response.content
          : Array.isArray(response.content)
            ? response.content.join(' ')
            : JSON.stringify(response.content);

      return {
        answer,
        sources: documents,
      };
    } catch (error) {
      this.logger.error('Error in RAG query:', error);
      throw error;
    }
  }

  private createPrompt(question: string, documents: IDocument[]): string {
    const context = documents
      .map((doc, i) => `[${i + 1}] ${doc.pageContent}`)
      .join('\n\n');

    return `You are a helpful assistant that provides information about products based on the given context.
Your task is to analyze the product information and answer questions about them.
If the answer is not explicitly stated in the context, respond with "I don't know" or "해당 정보는 제공된 컨텍스트에 없습니다."
DO NOT use any external knowledge or make assumptions.
DO NOT mention that you are using a context or that you are an AI assistant.
Just provide the direct answer based on the context.

[CONTEXT]
${context}

[QUESTION]
${question}

[ANSWER]
Provide a direct, concise answer using ONLY the information from the context above.`;
  }
}
