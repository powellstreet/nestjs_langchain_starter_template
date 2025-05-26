import { Injectable } from '@nestjs/common';
import { ChatChain } from '../langchain/chains/chat.chain';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

@Injectable()
export class ChatService {
  constructor(private readonly chatChain: ChatChain) {}

  async sendMessage(message: string): Promise<string> {
    try {
      return await this.chatChain.chat(message);
    } catch (error) {
      console.error('Error in chat service:', error);
      throw error;
    }
  }

  async getHistory(): Promise<(HumanMessage | AIMessage)[]> {
    return await this.chatChain.getHistory();
  }

  async clearHistory(): Promise<void> {
    await this.chatChain.clearHistory();
  }
}
