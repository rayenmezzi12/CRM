import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserItem {
  id: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  mustChangePassword: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  private http = inject(HttpClient);

  getUsers(page = 0, size = 10): Observable<Page<UserItem>> {
    return this.http.get<Page<UserItem>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  createUser(user: { username: string; email: string; password: string; role: string }): Observable<UserItem> {
    return this.http.post<UserItem>(this.apiUrl, user);
  }

  updateUserRole(userId: number, role: string): Observable<UserItem> {
    return this.http.put<UserItem>(`${this.apiUrl}/${userId}/role`, { role });
  }

  toggleUserEnabled(userId: number): Observable<UserItem> {
    return this.http.put<UserItem>(`${this.apiUrl}/${userId}/toggle-status`, {});
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
