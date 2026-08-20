import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  accessToken: string;
  username: string;
  role: string;
  mustChangePassword: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  
  private tokenSignal = signal<string | null>(null);
  private currentUserSignal = signal<Omit<AuthResponse, 'accessToken'> | null>(null);

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.tokenSignal.set(response.accessToken);
        this.currentUserSignal.set({
          username: response.username,
          role: response.role,
          mustChangePassword: response.mustChangePassword
        });
      })
    );
  }

  changePassword(passwords: { oldPassword: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, passwords).pipe(
      tap(() => {
        const user = this.currentUserSignal();
        if (user) {
          this.currentUserSignal.set({ ...user, mustChangePassword: false });
        }
      })
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  getCurrentUser(): Omit<AuthResponse, 'accessToken'> | null {
    return this.currentUserSignal();
  }

  isAuthenticated(): boolean {
    return this.tokenSignal() !== null;
  }
}
