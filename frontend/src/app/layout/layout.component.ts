import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <mat-toolbar color="primary">CRM Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/profile" routerLinkActive="active">Mon Profil</a>
          
          <!-- Only visible to ADMIN or SUPER_ADMIN -->
          <a *ngIf="isAdmin()" mat-list-item routerLink="/employees" routerLinkActive="active">
            Gestion Employés
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>Application CRM</span>
          <span class="spacer"></span>
          <span>{{ currentUser?.username }} ({{ currentUser?.role }})</span>
          <button mat-icon-button (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
          </button>
        </mat-toolbar>
        <div class="content-padding">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    .sidenav {
      width: 250px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content-padding {
      padding: 20px;
    }
    .active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.getCurrentUser();

  isAdmin(): boolean {
    return this.currentUser?.role === 'ROLE_ADMIN' || this.currentUser?.role === 'ROLE_SUPER_ADMIN';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
