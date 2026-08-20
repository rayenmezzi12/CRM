import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id?: number;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  address?: string;
  userId?: number;
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
export class ClientService {
  private apiUrl = '/api/clients';
  private http = inject(HttpClient);

  getClients(page = 0, size = 10): Observable<Page<Client>> {
    return this.http.get<Page<Client>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMyClientProfile(): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/me`);
  }
}
