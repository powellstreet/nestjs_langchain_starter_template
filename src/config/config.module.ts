import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './app.config';
import dbConfig from './database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 이 설정을 사용할 수 있도록 함
      envFilePath: '.env', // 환경 변수를 .env 파일에서 로드
      load: [appConfig, dbConfig], // 여러 설정을 병합
    }),
  ],
  exports: [ConfigModule], // 다른 모듈에서 사용할 수 있도록 export
})
export class ConfigureModule {}
