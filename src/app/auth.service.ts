import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://iom-be.onrender.com/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  login(userId: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { userId, password }, this.httpOptions)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  getToken(): string|null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
