import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards';

// modules
import { ConfigureModule } from './config/config.module';
import { TemplateModule } from './modules/template/template.module';

@Module({
  imports: [ConfigureModule, TemplateModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
