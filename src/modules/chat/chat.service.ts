import { Injectable } from '@nestjs/common';
import { ChatChain } from '../langchain/chains/chat.chain';

@Injectable()
export class ChatService {
  constructor(private readonly chatChain: ChatChain) {}

  async sendMessage(message: string): Promise<string> {
    return await this.chatChain.chat(message);
  }
}
