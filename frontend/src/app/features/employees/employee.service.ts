import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  position?: string;
  hireDate?: string;
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
export class EmployeeService {
  private apiUrl = '/api/employees';
  private http = inject(HttpClient);

  getEmployees(page = 0, size = 10): Observable<Page<Employee>> {
    return this.http.get<Page<Employee>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMyProfile(): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/me`);
  }
}
