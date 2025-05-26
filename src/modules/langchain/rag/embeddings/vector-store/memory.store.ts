import { Injectable } from '@nestjs/common';
import { IVectorStore } from '../../interfaces/vector-store.interface';
import { IDocument } from '../../interfaces/document.interface';
import { OpenAIEmbeddings } from '@langchain/openai';

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

@Injectable()
export class MemoryVectorStore implements IVectorStore {
  private documents: IDocument[] = [];
  private embeddings: number[][] = [];
  private embeddingModel = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
    modelName: 'text-embedding-ada-002',
  });

  async addDocuments(documents: IDocument[]): Promise<void> {
    for (const doc of documents) {
      if (!doc.pageContent) {
        console.error('Document missing pageContent:', doc);
        continue;
      }
      const embedding = await this.embeddingModel.embedQuery(doc.pageContent);
      doc.embedding = embedding;
      this.documents.push(doc);
      this.embeddings.push(embedding);
    }
  }

  async similaritySearch(query: string, k: number): Promise<IDocument[]> {
    if (this.documents.length === 0) return [];
    const queryEmbedding = await this.embeddingModel.embedQuery(query);
    const similarities = this.embeddings.map((emb, idx) => ({
      idx,
      score: cosineSimilarity(queryEmbedding, emb),
    }));
    similarities.sort((a, b) => b.score - a.score);
    return similarities.slice(0, k).map((s) => this.documents[s.idx]);
  }

  async deleteDocuments(filter: Record<string, any>): Promise<void> {
    if (Object.keys(filter).length === 0) {
      this.documents = [];
      this.embeddings = [];
      return;
    }
    const filtered: IDocument[] = [];
    const filteredEmbeddings: number[][] = [];
    for (let i = 0; i < this.documents.length; i++) {
      const doc = this.documents[i];
      if (
        !Object.entries(filter).every(
          ([key, value]) => doc.metadata[key] === value,
        )
      ) {
        filtered.push(doc);
        filteredEmbeddings.push(this.embeddings[i]);
      }
    }
    this.documents = filtered;
    this.embeddings = filteredEmbeddings;
  }
}
