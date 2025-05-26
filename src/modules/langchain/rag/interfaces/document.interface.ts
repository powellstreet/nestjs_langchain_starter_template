export interface IDocument {
  pageContent: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface DataSourceMetadata {
  type: string;
  lastUpdated: Date;
  documentCount: number;
  [key: string]: any;
}
