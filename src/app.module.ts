import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoldiersModule } from './soldiers/soldiers.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SoldiersModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
