import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService, Employee } from '../employees/employee.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card" *ngIf="profile; else loading">
        <mat-card-header>
          <div mat-card-avatar class="header-image">
            <mat-icon>account_circle</mat-icon>
          </div>
          <mat-card-title>Mon Profil</mat-card-title>
          <mat-card-subtitle>{{ profile.firstName }} {{ profile.lastName }}</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <mat-list>
            <mat-list-item>
              <mat-icon matListItemIcon>email</mat-icon>
              <div matListItemTitle>Email</div>
              <div matListItemLine>{{ profile.email }}</div>
            </mat-list-item>

            <mat-list-item>
              <mat-icon matListItemIcon>business</mat-icon>
              <div matListItemTitle>Département</div>
              <div matListItemLine>{{ profile.department || 'Non spécifié' }}</div>
            </mat-list-item>

            <mat-list-item>
              <mat-icon matListItemIcon>work</mat-icon>
              <div matListItemTitle>Poste</div>
              <div matListItemLine>{{ profile.position || 'Non spécifié' }}</div>
            </mat-list-item>

            <mat-list-item>
              <mat-icon matListItemIcon>calendar_today</mat-icon>
              <div matListItemTitle>Date d'embauche</div>
              <div matListItemLine>{{ (profile.hireDate | date:'longDate') || 'Non spécifiée' }}</div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>

      <ng-template #loading>
        <div class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
    .profile-card {
      width: 100%;
      max-width: 600px;
    }
    .header-image mat-icon {
      font-size: 40px;
      height: 40px;
      width: 40px;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 50px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  profile: Employee | null = null;

  ngOnInit(): void {
    this.employeeService.getMyProfile().subscribe({
      next: (data: Employee) => {
        this.profile = data;
      },
      error: (err: unknown) => {
        console.error('Erreur lors du chargement du profil', err);
      }
    });
  }
}
