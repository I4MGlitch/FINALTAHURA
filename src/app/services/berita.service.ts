import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeritaService {

  private baseUrl = 'https://finaltahura.vercel.app';
  //private baseUrl = 'http://localhost:4242';

  constructor(private http: HttpClient) {}

  getBeritaDetails(id: String): Observable<any> {
    const url = `${this.baseUrl}/api/getBeritaDetails/${id}`; 
    return this.http.get<any>(url);
  }
  getAllBerita(): Observable<any> {
    const url = `${this.baseUrl}/api/getAllBerita`;
    return this.http.get<any>(url);
  }
  getPartialBerita(): Observable<any> {
    const url = `${this.baseUrl}/api/getPartialBerita`;
    return this.http.get<any>(url);
  }
  getLoadBeritas(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
      return this.http.get<any[]>(`${this.baseUrl}/api/getLoadBeritas`, { params });
  }
}
