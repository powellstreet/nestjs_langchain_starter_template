import { DocumentBuilder } from '@nestjs/swagger';

export const createSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Mozy API')
    .setDescription('Mozi API description')
    .setVersion('1.0')
    .build();
};
