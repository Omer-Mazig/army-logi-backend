import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ReportsService {
  private readonly url = process.env.GOOGLE_SCRIPT_URL || '';
  private readonly columnMap: Record<string, string> = {
    'חותמת זמן': 'timestamp',
    'מספר אישי': 'personalNumber',
    'נשק אישי - צ׳': 'personalWeaponNumber',
    'כוונת נשק אישי - צ׳ (לא מק״ט!)': 'personalSightsNumber',
    'פק״ל מפקד - אמר״ל': 'nightVisionNumber',
    'פק״ל מפקד - משקפת': 'binocularsNumber',
    'פק״ל מפקד - מצפן (כתוב ״יש״ אם יש)': 'hasCompass',
    'סמים - אקטיק (הכנס כמות)': 'actiq',
    'סמים - מורפין (הכנס כמות)': 'morphine',
    'סמים - מידזולם (הכנס כמות)': 'midazolam',
    'סמים - קטאמין 50 מ״ג (הכנס כמות)': 'ketamine50mg',
    'סמים - קטאמין 10 מ״ג (הכנס כמות)': 'ketamine10mg',
  };

  constructor(private readonly httpService: HttpService) {}

  private buildUrl(type: string, action?: string): string {
    const params = new URLSearchParams({ type });
    if (action) params.append('action', action);
    return `${this.url}?${params.toString()}`;
  }

  getDailyReports() {
    return this.httpService.get(this.buildUrl('reports')).pipe(
      map((res) => {
        const rawData = res.data;

        // Handle case where data comes as 2D array (Google Sheets format)
        if (
          Array.isArray(rawData) &&
          rawData.length > 0 &&
          Array.isArray(rawData[0])
        ) {
          // Data is in 2D array format: [headers, ...rows]
          const headers = rawData[0];
          const dataRows = rawData.slice(1);

          console.log('Original Hebrew headers:', headers);

          // Map Hebrew headers to English
          const englishHeaders = headers.map((header) => {
            const mapped = this.columnMap[header] || header;
            console.log(`Mapping: "${header}" -> "${mapped}"`);
            return mapped;
          });

          console.log('Mapped English headers:', englishHeaders);
          console.log('Data rows count:', dataRows.length);

          // Return in same 2D array format but with English headers
          return [englishHeaders, ...dataRows];
        }

        // Handle case where data comes as array of objects
        if (Array.isArray(rawData)) {
          return rawData.map((entry) => {
            const parsed: Record<string, any> = {};
            for (const key in this.columnMap) {
              if (entry.hasOwnProperty(key)) {
                parsed[this.columnMap[key]] = entry[key];
              }
            }
            return parsed;
          });
        }

        return [];
      }),
    );
  }
}
