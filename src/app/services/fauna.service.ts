import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaunaService {

  private baseUrl = 'https://finaltahura.vercel.app';
  //private baseUrl = 'http://localhost:4242';

  constructor(private http: HttpClient) {}

  getFaunaDetails(id: String): Observable<any> {
    const url = `${this.baseUrl}/api/getFaunaDetails/${id}`;
    return this.http.get<any>(url);
  }
  getAllFauna(): Observable<any> {
    const url = `${this.baseUrl}/api/getAllFauna`;
    return this.http.get<any>(url);
  }
  getPartialFauna(): Observable<any[]> {
    const url = `${this.baseUrl}/api/getPartialFauna`;
    return this.http.get<any[]>(url);
  }
  getLoadFauna(page: number, limit: number): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<any[]>(`${this.baseUrl}/api/getLoadFauna`, { params })
  }
  searchFauna(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/search/fauna`, { params: { query } });
  }
}
