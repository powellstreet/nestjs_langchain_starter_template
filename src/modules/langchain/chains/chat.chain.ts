import { Injectable, Inject } from '@nestjs/common';
import { ChatPrompt } from '../prompts/chat.prompt';
import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatMemory } from '../memory/chat.memory';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { RagService } from '../rag/rag.service';
import { Logger } from '@nestjs/common';
import { IDocument } from '../rag/interfaces/document.interface';

interface ChatInput {
  message: string;
}

interface ChatOutput {
  answer: string;
  sources: IDocument[];
}

@Injectable()
export class ChatChain {
  private model: ChatOpenAI;
  private chain: RunnableSequence;
  private readonly logger = new Logger(ChatChain.name);

  constructor(
    @Inject('LANGCHAIN_CONFIG')
    private config: { openaiApiKey: string; modelName: string },
    private readonly chatPrompt: ChatPrompt,
    private readonly chatMemory: ChatMemory,
    private readonly ragService: RagService,
  ) {
    // OpenAI 모델 초기화
    this.model = new ChatOpenAI({
      openAIApiKey: this.config.openaiApiKey,
      modelName: this.config.modelName,
      temperature: 0.7,
    });

    // 체인 구성
    this.chain = RunnableSequence.from([
      this.chatPrompt.getPrompt(),
      this.model,
      new StringOutputParser(),
    ]);
  }

  async chat(message: string): Promise<string> {
    try {
      const ragResult = await this.ragService.query(message);
      return ragResult.answer;
    } catch (error) {
      this.logger.error('Error in chat chain:', error);
      throw error;
    }
  }

  // 대화 기록 초기화
  async clearHistory(): Promise<void> {
    await this.chatMemory.clearHistory();
  }

  // 대화 기록 가져오기
  async getHistory(): Promise<(HumanMessage | AIMessage)[]> {
    return await this.chatMemory.getChatHistory();
  }
}
