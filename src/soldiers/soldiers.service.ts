import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SoldiersService {
  // TODO: move to env
  private readonly url = process.env.GOOGLE_SCRIPT_URL || '';
  constructor(private readonly httpService: HttpService) {}

  getSoldiers(): Observable<any> {
    return this.httpService
      .get(this.url)
      .pipe(map((response) => response.data));
  }

  getPersonalNumbers(): Observable<any> {
    return this.httpService
      .get(this.url + '?action=personal-numbers')
      .pipe(map((response) => response.data));
  }
}
