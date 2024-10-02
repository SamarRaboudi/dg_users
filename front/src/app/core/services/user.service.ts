import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'users'; // Base API URL

  constructor(private http: HttpClient) { }

  // Create a new user
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/new`, user);
  }

  // Get all users
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get a user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Update a user by ID
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, user);
  }

  // Delete a user by ID
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
