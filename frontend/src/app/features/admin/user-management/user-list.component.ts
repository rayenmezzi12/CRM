import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, UserItem } from './user.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="user-management-container">
      <h2>Gestion des Utilisateurs & Administrateurs</h2>

      <!-- Create User Card -->
      <mat-card class="create-card">
        <mat-card-header>
          <mat-card-title>Créer un nouvel utilisateur / Administrateur</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="createUserForm" (ngSubmit)="onCreateUser()" class="inline-form">
            <mat-form-field appearance="fill">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput formControlName="username" required>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Mot de passe temporaire</mat-label>
              <input matInput type="password" formControlName="password" required>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Rôle</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="ROLE_SUPER_ADMIN">Super Administrateur</mat-option>
                <mat-option value="ROLE_ADMIN">Administrateur</mat-option>
                <mat-option value="ROLE_EMPLOYEE">Employé</mat-option>
                <mat-option value="ROLE_CLIENT">Client</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="createUserForm.invalid || isSubmitting">
              Ajouter Utilisateur
            </button>
          </form>
          <div *ngIf="message" class="message">{{ message }}</div>
        </mat-card-content>
      </mat-card>

      <!-- User List Table -->
      <table mat-table [dataSource]="users" class="mat-elevation-z8">

        <ng-container matColumnDef="username">
          <th mat-header-cell *matHeaderCellDef> Nom d'utilisateur </th>
          <td mat-cell *matCellDef="let element"> {{element.username}} </td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef> Email </th>
          <td mat-cell *matCellDef="let element"> {{element.email}} </td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef> Rôle </th>
          <td mat-cell *matCellDef="let element">
            <mat-select [value]="element.role" (selectionChange)="changeRole(element.id, $event.value)">
              <mat-option value="ROLE_SUPER_ADMIN">SUPER_ADMIN</mat-option>
              <mat-option value="ROLE_ADMIN">ADMIN</mat-option>
              <mat-option value="ROLE_EMPLOYEE">EMPLOYEE</mat-option>
              <mat-option value="ROLE_CLIENT">CLIENT</mat-option>
            </mat-select>
          </td>
        </ng-container>

        <ng-container matColumnDef="enabled">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let element">
            <mat-slide-toggle [checked]="element.enabled" (change)="toggleStatus(element.id)">
              {{ element.enabled ? 'Actif' : 'Inactif' }}
            </mat-slide-toggle>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="warn" (click)="deleteUser(element.id)" [disabled]="element.username === 'superadmin'">
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
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 10px;
    }
    .create-card {
      margin-bottom: 20px;
    }
    .inline-form {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      align-items: center;
      margin-top: 10px;
    }
    table {
      width: 100%;
    }
    .message {
      margin-top: 10px;
      color: #1976d2;
      font-weight: 500;
    }
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  users: UserItem[] = [];
  displayedColumns: string[] = ['username', 'email', 'role', 'enabled', 'actions'];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  isSubmitting = false;
  message = '';

  createUserForm: FormGroup;

  constructor() {
    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['ROLE_ADMIN', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(this.pageIndex, this.pageSize).subscribe(page => {
      this.users = page.content;
      this.totalElements = page.totalElements;
    });
  }

  handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadUsers();
  }

  onCreateUser(): void {
    if (this.createUserForm.valid) {
      this.isSubmitting = true;
      this.message = '';
      this.userService.createUser(this.createUserForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.message = 'Utilisateur créé avec succès !';
          this.createUserForm.reset({ role: 'ROLE_ADMIN' });
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.message = 'Erreur lors de la création de l\'utilisateur';
          console.error(err);
        }
      });
    }
  }

  changeRole(userId: number, role: string): void {
    this.userService.updateUserRole(userId, role).subscribe(() => {
      this.loadUsers();
    });
  }

  toggleStatus(userId: number): void {
    this.userService.toggleUserEnabled(userId).subscribe(() => {
      this.loadUsers();
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
