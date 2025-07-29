import { Module } from '@nestjs/common';
import { SoldiersService } from './soldiers.service';
import { SoldiersController } from './soldiers.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SoldiersController],
  providers: [SoldiersService],
  imports: [HttpModule],
})
export class SoldiersModule {}
