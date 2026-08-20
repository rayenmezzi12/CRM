import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService, Client } from '../client.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  template: `
    <div class="header">
      <h2>Gestion des Clients</h2>
      <button mat-raised-button color="primary" (click)="addClient()">
        <mat-icon>add</mat-icon> Ajouter un Client
      </button>
    </div>

    <table mat-table [dataSource]="clients" class="mat-elevation-z8">
      
      <ng-container matColumnDef="companyName">
        <th mat-header-cell *matHeaderCellDef> Entreprise / Société </th>
        <td mat-cell *matCellDef="let element"> {{element.companyName}} </td>
      </ng-container>

      <ng-container matColumnDef="contactName">
        <th mat-header-cell *matHeaderCellDef> Personne de Contact </th>
        <td mat-cell *matCellDef="let element"> {{element.contactName}} </td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef> Email </th>
        <td mat-cell *matCellDef="let element"> {{element.email}} </td>
      </ng-container>

      <ng-container matColumnDef="phone">
        <th mat-header-cell *matHeaderCellDef> Téléphone </th>
        <td mat-cell *matCellDef="let element"> {{element.phone || '-'}} </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="primary" (click)="editClient(element.id)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteClient(element.id)">
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
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);

  clients: Client[] = [];
  displayedColumns: string[] = ['companyName', 'contactName', 'email', 'phone', 'actions'];
  
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients(this.pageIndex, this.pageSize).subscribe(page => {
      this.clients = page.content;
      this.totalElements = page.totalElements;
    });
  }

  handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadClients();
  }

  addClient(): void {
    this.router.navigate(['/clients/new']);
  }

  editClient(id: number): void {
    this.router.navigate(['/clients', id, 'edit']);
  }

  deleteClient(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.loadClients();
      });
    }
  }
}
