import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = 'http://localhost:4000/api';
  token=localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json','Authorization':`Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }
  fetchEnvironment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllgetAllEnvironments`, this.httpOptions);
  }
  fetchAllServicesOfaEnvironment(envId:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllServiceFromAnEnvironment/${envId}`, this.httpOptions);
  }
}
