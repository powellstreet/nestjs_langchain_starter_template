import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { Document } from '@langchain/core/documents';
import { IDataLoader } from '../interfaces/loader.interface';
import { IDocument } from '../interfaces/document.interface';
import { DataSourceMetadata } from '../interfaces/data-source.interface';
import * as path from 'path';

@Injectable()
export class JsonLoader implements IDataLoader {
  private filePath: string;

  constructor(config: { path: string }) {
    this.filePath = config.path;
  }

  async load(): Promise<IDocument[]> {
    const fileContent = await fs.readFile(this.filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const products = data.products || [];

    return products.map((product: any) => {
      if (!product || typeof product !== 'object') {
        throw new Error('Invalid product data format');
      }

      // 모든 메타데이터 정보를 포함한 content 생성
      const content = [
        `상품명: ${product.name || '이름 없음'}`,
        `유형: ${product.type || '유형 없음'}`,
        `가격: ${product.price || 0}원`,
        `인기도: ${product.popularity || 0}점`,
        `설명: ${product.description || '설명 없음'}`,
        product.metadata?.allergens
          ? `알레르기 주의: 이 상품은 ${product.metadata.allergens.join(', ')} 알레르기가 있는 사람에게 위험할 수 있습니다.`
          : '',
        Object.entries(product.metadata || {})
          .filter(([key]) => key !== 'allergens')
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(', ')}`;
            }
            return `${key}: ${value}`;
          })
          .join('\n'),
      ]
        .filter(Boolean)
        .join('\n');

      if (!content) {
        throw new Error('Failed to generate content for product');
      }

      const doc = new Document({
        pageContent: content,
        metadata: {
          id: product.id,
          type: product.type,
          name: product.name,
          price: product.price,
          popularity: product.popularity,
          description: product.description,
          ...product.metadata,
        },
      });

      if (!doc.pageContent) {
        throw new Error('Document pageContent is undefined');
      }

      return doc;
    });
  }

  async validate(): Promise<boolean> {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      return !!data.products && Array.isArray(data.products);
    } catch (e) {
      return false;
    }
  }

  async getMetadata(): Promise<DataSourceMetadata> {
    const documents = await this.load();
    return {
      type: 'json',
      lastUpdated: new Date().toISOString(),
      documentCount: documents.length,
      filePath: this.filePath,
    };
  }
}
