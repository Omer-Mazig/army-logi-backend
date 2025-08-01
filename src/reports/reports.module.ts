import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [HttpModule],
})
export class ReportsModule {}
