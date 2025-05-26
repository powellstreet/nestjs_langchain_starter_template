import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';

@Injectable()
export class ChatPrompt {
  private prompt: ChatPromptTemplate;

  constructor() {
    this.prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are a helpful AI assistant that provides accurate and relevant information.
When answering questions, you should:
1. Use the provided context from the knowledge base when available
2. If the context doesn't contain the answer, say "해당 정보는 제공된 컨텍스트에 없습니다."
3. Maintain a natural conversation flow
4. Be concise and direct in your responses

[CONTEXT]
{rag_context}

[CHAT HISTORY]
{chat_history}

Now, please respond to the user's message.`,
      ),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);
  }

  getPrompt(): ChatPromptTemplate {
    return this.prompt;
  }
}
