import { Injectable, Inject } from '@nestjs/common';
import { ChatPrompt } from '../prompts/chat.prompt';
import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class ChatChain {
  private model: ChatOpenAI;
  private chain: RunnableSequence;

  constructor(
    @Inject('LANGCHAIN_CONFIG')
    private config: { openaiApiKey: string; modelName: string },
    private readonly chatPrompt: ChatPrompt,
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
      const response = await this.chain.invoke({ input: message });
      return response;
    } catch (error) {
      console.error('Error in chat chain:', error);
      throw new Error('Failed to generate response');
    }
  }
}
