import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoldiersModule } from './soldiers/soldiers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SoldiersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
