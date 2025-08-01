import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable()
export class SoldiersService {
  private readonly url = process.env.GOOGLE_SCRIPT_URL || '';
  private personalNumbersCache: string[] | null = null;
  private isUpdating = false;

  constructor(private readonly httpService: HttpService) {}

  private buildUrl(type: string, action?: string): string {
    const params = new URLSearchParams({ type });
    if (action) params.append('action', action);
    return `${this.url}?${params.toString()}`;
  }

  getSoldiers(): Observable<any[]> {
    return this.httpService
      .get(this.buildUrl('soldiers'))
      .pipe(map((response) => response.data));
  }

  getPersonalNumbers(): Observable<string[]> {
    if (this.personalNumbersCache) {
      this.updatePersonalNumbersAsync(); // update in background
      return of(this.personalNumbersCache);
    }

    return this.httpService
      .get(this.buildUrl('soldiers', 'personal-numbers'))
      .pipe(
        map((response) => response.data),
        tap((data) => {
          this.personalNumbersCache = data;
        }),
      );
  }

  private updatePersonalNumbersAsync(): void {
    if (this.isUpdating) return;

    this.isUpdating = true;

    this.httpService
      .get(this.buildUrl('soldiers', 'personal-numbers'))
      .pipe(
        map((res) => res.data),
        tap((data) => {
          this.personalNumbersCache = data;
        }),
        catchError((err) => {
          console.error('Failed to update personal numbers:', err);
          return of(null);
        }),
      )
      .subscribe(() => {
        this.isUpdating = false;
      });
  }
}
