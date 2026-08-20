import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="change-password-container">
      <mat-card class="change-password-card">
        <mat-card-header>
          <mat-card-title>Changement de mot de passe obligatoire</mat-card-title>
          <mat-card-subtitle>
            C'est votre première connexion avec un mot de passe temporaire. Veuillez définir votre nouveau mot de passe.
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="changePasswordForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Mot de passe actuel (temporaire)</mat-label>
              <input matInput type="password" formControlName="oldPassword" required>
              <mat-error *ngIf="changePasswordForm.get('oldPassword')?.hasError('required')">
                Le mot de passe actuel est requis
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Nouveau mot de passe</mat-label>
              <input matInput type="password" formControlName="newPassword" required>
              <mat-error *ngIf="changePasswordForm.get('newPassword')?.hasError('required')">
                Le nouveau mot de passe est requis
              </mat-error>
              <mat-error *ngIf="changePasswordForm.get('newPassword')?.hasError('minlength')">
                Le mot de passe doit faire au moins 6 caractères
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Confirmer le nouveau mot de passe</mat-label>
              <input matInput type="password" formControlName="confirmPassword" required>
              <mat-error *ngIf="changePasswordForm.hasError('passwordsMismatch')">
                Les mots de passe ne correspondent pas
              </mat-error>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div *ngIf="successMessage" class="success-message">
              {{ successMessage }}
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="changePasswordForm.invalid || isLoading" class="full-width">
              {{ isLoading ? 'Enregistrement...' : 'Valider le nouveau mot de passe' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .change-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .change-password-card {
      width: 100%;
      max-width: 450px;
      padding: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .error-message {
      color: red;
      margin-bottom: 15px;
      text-align: center;
    }
    .success-message {
      color: green;
      margin-bottom: 15px;
      text-align: center;
    }
    mat-card-title {
      margin-bottom: 10px;
      text-align: center;
      width: 100%;
    }
    mat-card-subtitle {
      margin-bottom: 20px;
      text-align: center;
    }
  `]
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { oldPassword, newPassword } = this.changePasswordForm.value;

      this.authService.changePassword({ oldPassword, newPassword }).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Mot de passe mis à jour avec succès ! Redirection...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Erreur lors du changement de mot de passe';
          console.error(err);
        }
      });
    }
  }
}
