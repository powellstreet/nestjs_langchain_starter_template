import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class ChatPrompt {
  getPrompt() {
    return ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are a helpful AI assistant. Please respond to the following message:',
      ],
      ['human', '{input}'],
    ]);
  }
}
