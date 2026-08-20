import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemService, MonitoringMetrics, AuditLog } from './system.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="monitoring-container">
      <h2>Accès aux Logs & Monitoring Système</h2>

      <!-- Metrics Cards Grid -->
      <div class="metrics-grid" *ngIf="metrics">
        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon color="primary">storage</mat-icon>
            <mat-card-title>Base de Données</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="status-ok">{{ metrics.dbStatus }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon color="accent">memory</mat-icon>
            <mat-card-title>Mémoire RAM System</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Libre :</strong> {{ metrics.freeMemoryMb }} MB / {{ metrics.totalMemoryMb }} MB</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon color="primary">timer</mat-icon>
            <mat-card-title>Uptime Temps de Fonctionnement</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Durée :</strong> {{ formatUptime(metrics.uptimeSeconds) }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon color="primary">group</mat-icon>
            <mat-card-title>Statistiques Système</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Utilisateurs :</strong> {{ metrics.totalUsers }} | <strong>Employés :</strong> {{ metrics.totalEmployees }} | <strong>Clients :</strong> {{ metrics.totalClients }}</p>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Logs Table -->
      <mat-card class="logs-card">
        <mat-card-header>
          <mat-card-title>Logs d'Activité System (Audit Trail)</mat-card-title>
          <button mat-icon-button (click)="refresh()"><mat-icon>refresh</mat-icon></button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="auditLogs" class="mat-elevation-z8">
            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef> Horodatage </th>
              <td mat-cell *matCellDef="let element"> {{ element.createdAt | date:'medium' }} </td>
            </ng-container>

            <ng-container matColumnDef="username">
              <th mat-header-cell *matHeaderCellDef> Utilisateur </th>
              <td mat-cell *matCellDef="let element"> {{ element.username }} </td>
            </ng-container>

            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef> Action </th>
              <td mat-cell *matCellDef="let element"> <code>{{ element.action }}</code> </td>
            </ng-container>

            <ng-container matColumnDef="details">
              <th mat-header-cell *matHeaderCellDef> Détails </th>
              <td mat-cell *matCellDef="let element"> {{ element.details }} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator 
            [length]="totalLogs"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="handlePageEvent($event)"
            aria-label="Select page">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .monitoring-container {
      padding: 10px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 15px;
      margin-bottom: 25px;
    }
    .metric-card mat-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .status-ok {
      color: #2e7d32;
      font-weight: 500;
    }
    .logs-card {
      margin-top: 10px;
    }
    table {
      width: 100%;
    }
  `]
})
export class MonitoringComponent implements OnInit {
  private systemService = inject(SystemService);

  metrics: MonitoringMetrics | null = null;
  auditLogs: AuditLog[] = [];
  displayedColumns: string[] = ['createdAt', 'username', 'action', 'details'];

  totalLogs = 0;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit(): void {
    this.loadMetrics();
    this.loadLogs();
  }

  loadMetrics(): void {
    this.systemService.getMonitoringMetrics().subscribe(m => this.metrics = m);
  }

  loadLogs(): void {
    this.systemService.getAuditLogs(this.pageIndex, this.pageSize).subscribe(page => {
      this.auditLogs = page.content;
      this.totalLogs = page.totalElements;
    });
  }

  handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadLogs();
  }

  refresh(): void {
    this.loadMetrics();
    this.loadLogs();
  }

  formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }
}
