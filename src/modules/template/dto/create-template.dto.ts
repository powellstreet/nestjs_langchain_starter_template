import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTemplateRequestDto {}
export class CreateTemplateResponseDto {
  @ApiProperty({
    description: '생성된 데이터 ID',
    example: 1,
  })
  @IsNumber()
  id: number;
}
