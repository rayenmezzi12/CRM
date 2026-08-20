import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SystemConfig {
  companyName: string;
  supportEmail: string;
  currency: string;
  maintenanceMode: boolean;
}

export interface MonitoringMetrics {
  uptimeSeconds: number;
  freeMemoryMb: number;
  totalMemoryMb: number;
  dbStatus: string;
  totalUsers: number;
  totalEmployees: number;
  totalClients: number;
}

export interface AuditLog {
  id: number;
  username: string;
  action: string;
  details: string;
  createdAt: string;
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
export class SystemService {
  private apiUrl = '/api/system';
  private http = inject(HttpClient);

  getSystemConfig(): Observable<SystemConfig> {
    return this.http.get<SystemConfig>(`${this.apiUrl}/config`);
  }

  updateSystemConfig(config: SystemConfig): Observable<SystemConfig> {
    return this.http.put<SystemConfig>(`${this.apiUrl}/config`, config);
  }

  getMonitoringMetrics(): Observable<MonitoringMetrics> {
    return this.http.get<MonitoringMetrics>(`${this.apiUrl}/monitoring`);
  }

  getAuditLogs(page = 0, size = 10): Observable<Page<AuditLog>> {
    return this.http.get<Page<AuditLog>>(`${this.apiUrl}/logs?page=${page}&size=${size}`);
  }
}
