import { Controller, Get, Post } from '@nestjs/common';
import { SoldiersService } from './soldiers.service';
import { Body } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Controller('soldiers')
export class SoldiersController {
  constructor(private readonly soldiersService: SoldiersService) {}

  @Get()
  async getSoldiers() {
    return firstValueFrom(this.soldiersService.getSoldiers());
  }

  @Get('personal-numbers')
  async getPersonalNumbers() {
    return firstValueFrom(this.soldiersService.getPersonalNumbers());
  }
}
