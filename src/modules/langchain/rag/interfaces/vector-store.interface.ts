import { IDocument } from './document.interface';

export interface IVectorStore {
  addDocuments(documents: IDocument[]): Promise<void>;
  similaritySearch(query: string, k: number): Promise<IDocument[]>;
  deleteDocuments(filter: Record<string, any>): Promise<void>;
}
