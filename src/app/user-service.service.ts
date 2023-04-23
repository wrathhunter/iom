import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = 'https://iom-be.onrender.com/api';
  token=localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json','Authorization':`Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }
  fetchEnvironment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllEnvironments`, this.httpOptions);
  }
  fetchAllServicesOfaEnvironment(envName:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllServiceFromAnEnvironment/${envName}`, this.httpOptions);
  }
}
