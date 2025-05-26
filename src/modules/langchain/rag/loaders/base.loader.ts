import { IDataLoader } from '../interfaces/loader.interface';
import {
  IDocument,
  DataSourceMetadata,
} from '../interfaces/document.interface';
import { DataSourceMetadata as DataSourceMetadataInterface } from '../interfaces/data-source.interface';

export abstract class BaseLoader implements IDataLoader {
  protected config: Record<string, any>;

  constructor(config: Record<string, any>) {
    this.config = config;
  }

  abstract load(): Promise<IDocument[]>;
  abstract validate(): Promise<boolean>;
  abstract getMetadata(): Promise<DataSourceMetadataInterface>;
}
