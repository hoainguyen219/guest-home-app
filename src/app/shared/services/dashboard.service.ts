import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConfig } from '../config/common';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public apiKey = GlobalConfig.API_KEY;
  constructor(
    private http: HttpClient
  ) { }

  getAdmin(): Observable<any> {
    return this.http.get(`${this.apiKey}/admin`) as Observable<any>;
  }

  deleteDashboard(params): Observable<any> {
    const {postId} = params;
    return this.http.delete(`${this.apiKey}/post/${postId}`) as Observable<any>;
  }

  confirmDashboard(params): Observable<any> {
    const {postId} = params;
    return this.http.post(`${this.apiKey}/admin/accept/${postId}`, {
      postId
    }) as Observable<any>;
  }

  getStatistic(): Observable<any> {
    return this.http.get(`${this.apiKey}/admin/tk`) as Observable<any>;
  }
}
