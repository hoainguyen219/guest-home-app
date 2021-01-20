import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalConfig } from '../config/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiKey = GlobalConfig.API_KEY;
  public currentUser$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor(
    private http: HttpClient
  ) { }

  login(params): Observable<any> {
    return this.http.post(`${this.apiKey}/login`, params) as Observable<any>;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser$.next({});
    location.reload();
  }

  setCurrentUser(user): void {
    localStorage.setItem('user', user);

    this.currentUser$.next(JSON.parse(user));
  }

  getCurrentUser(): void {
    const user = localStorage.getItem('user');
    console.log(user);
    this.currentUser$.next(JSON.parse(user));
  }

  registerUser(params): Observable<any> {
    return this.http.post(`${this.apiKey}/register`, params) as Observable<any>;
  }
}
