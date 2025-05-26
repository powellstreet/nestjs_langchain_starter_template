import { Injectable, Inject } from '@nestjs/common';
import { ChatPrompt } from '../prompts/chat.prompt';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class ChatChain {
  constructor(
    @Inject('LANGCHAIN_CONFIG') private config: any,
    private readonly chatPrompt: ChatPrompt,
  ) {}

  async chat(message: string): Promise<string> {
    // TODO: 실제 LLM 모델을 추가할 때 이 부분을 수정해야 합니다
    // 현재는 에코 응답만 반환합니다
    return `Echo: ${message}`;
  }
}
