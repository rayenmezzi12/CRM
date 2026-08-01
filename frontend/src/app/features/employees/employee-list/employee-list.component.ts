import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService, Employee } from '../employee.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  template: `
    <div class="header">
      <h2>Liste des Employés</h2>
      <button mat-raised-button color="primary" (click)="addEmployee()">
        <mat-icon>add</mat-icon> Ajouter un Employé
      </button>
    </div>

    <table mat-table [dataSource]="employees" class="mat-elevation-z8">
      
      <ng-container matColumnDef="firstName">
        <th mat-header-cell *matHeaderCellDef> Prénom </th>
        <td mat-cell *matCellDef="let element"> {{element.firstName}} </td>
      </ng-container>

      <ng-container matColumnDef="lastName">
        <th mat-header-cell *matHeaderCellDef> Nom </th>
        <td mat-cell *matCellDef="let element"> {{element.lastName}} </td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef> Email </th>
        <td mat-cell *matCellDef="let element"> {{element.email}} </td>
      </ng-container>

      <ng-container matColumnDef="department">
        <th mat-header-cell *matHeaderCellDef> Département </th>
        <td mat-cell *matCellDef="let element"> {{element.department}} </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="primary" (click)="editEmployee(element.id)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteEmployee(element.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator 
      [length]="totalElements"
      [pageSize]="pageSize"
      [pageSizeOptions]="[5, 10, 25, 100]"
      (page)="handlePageEvent($event)"
      aria-label="Select page">
    </mat-paginator>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  employees: Employee[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'department', 'actions'];
  
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(this.pageIndex, this.pageSize).subscribe(page => {
      this.employees = page.content;
      this.totalElements = page.totalElements;
    });
  }

  handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadEmployees();
  }

  addEmployee(): void {
    this.router.navigate(['/employees/new']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees', id, 'edit']);
  }

  deleteEmployee(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet employé ?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }
}
