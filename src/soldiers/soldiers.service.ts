import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable()
export class SoldiersService {
  private readonly url = process.env.GOOGLE_SCRIPT_URL || '';
  // TODO: fix any
  private personalNumbers: any = null; // in memory cache
  private isUpdating = false;

  constructor(private readonly httpService: HttpService) {}

  getSoldiers(): Observable<any> {
    return this.httpService
      .get(this.url)
      .pipe(map((response) => response.data));
  }

  getPersonalNumbers(): Observable<any> {
    // If we have cached personal numbers, return them and update in background
    if (this.personalNumbers) {
      this.updatePersonalNumbersAsync();
      return of(this.personalNumbers);
    }

    // No cache, fetch for the first time
    return this.httpService.get(this.url + '?action=personal-numbers').pipe(
      map((response) => response.data),
      tap((data) => {
        this.personalNumbers = data;
      }),
    );
  }

  private updatePersonalNumbersAsync(): void {
    // Don't update if already updating
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.httpService
      .get(this.url + '?action=personal-numbers')
      .pipe(
        map((response) => response.data),
        tap((data) => {
          this.personalNumbers = data;
        }),
        catchError((error) => {
          console.error('Failed to update personal numbers cache:', error);
          return of(null);
        }),
      )
      .subscribe(() => {
        this.isUpdating = false;
      });
  }
}
