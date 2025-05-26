import { IDocument } from './document.interface';
import { DataSourceMetadata } from './data-source.interface';

export interface IDataLoader {
  load(): Promise<IDocument[]>;
  validate(): Promise<boolean>;
  getMetadata(): Promise<DataSourceMetadata>;
}
