import { Injectable } from '@nestjs/common';
import { BufferMemory } from 'langchain/memory';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

@Injectable()
export class ChatMemory {
  private memory: BufferMemory;
  private model: ChatOpenAI;

  constructor() {
    // 메모리 초기화
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'chat_history',
      inputKey: 'input',
      outputKey: 'output',
    });

    // 모델 초기화 (메모리에서 사용)
    this.model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
    });
  }

  // 대화 기록 가져오기
  async getChatHistory(): Promise<(HumanMessage | AIMessage)[]> {
    const history = await this.memory.chatHistory.getMessages();
    return history;
  }

  // 새로운 메시지 추가
  async addMessage(input: string, output: string): Promise<void> {
    await this.memory.saveContext({ input }, { output });
  }

  // 대화 기록 초기화
  async clearHistory(): Promise<void> {
    await this.memory.clear();
  }

  // 현재 메모리 상태 가져오기
  async getMemoryVariables(): Promise<Record<string, any>> {
    return await this.memory.loadMemoryVariables({});
  }
}
