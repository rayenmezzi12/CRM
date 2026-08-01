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
  
  // Store token in memory, not in localStorage as requested
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
