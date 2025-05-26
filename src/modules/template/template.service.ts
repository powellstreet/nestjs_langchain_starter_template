import { Injectable } from '@nestjs/common';
import { CreateTemplateRequestDto, CreateTemplateResponseDto } from './dto';

@Injectable()
export class TemplateService {
  async create(
    body: CreateTemplateRequestDto,
  ): Promise<CreateTemplateResponseDto> {
    const createdDataId = 1;
    const data = {
      id: createdDataId,
    };
    return data;
  }

  async findAll() {
    const data = [];
    return data;
  }
}
