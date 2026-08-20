import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SystemService, SystemConfig } from './system.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  template: `
    <div class="config-container">
      <mat-card class="config-card">
        <mat-card-header>
          <mat-card-title>Configuration Système & Paramètres Globaux</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="configForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Nom de l'entreprise CRM</mat-label>
              <input matInput formControlName="companyName" required>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email de support système</mat-label>
              <input matInput type="email" formControlName="supportEmail" required>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Devise principale</mat-label>
              <mat-select formControlName="currency">
                <mat-option value="EUR">Euro (€)</mat-option>
                <mat-option value="TND">Dinar Tunisien (DT)</mat-option>
                <mat-option value="USD">Dollar ($)</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="toggle-field">
              <mat-slide-toggle formControlName="maintenanceMode">
                Mode Maintenance Activé
              </mat-slide-toggle>
            </div>

            <div *ngIf="message" class="message">{{ message }}</div>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="configForm.invalid || isSubmitting">
                {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer la configuration' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .config-container {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
    .config-card {
      width: 100%;
      max-width: 600px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .toggle-field {
      margin-bottom: 20px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
    }
    .message {
      color: green;
      margin-bottom: 15px;
      font-weight: 500;
    }
  `]
})
export class SystemConfigComponent implements OnInit {
  private systemService = inject(SystemService);
  private fb = inject(FormBuilder);

  configForm: FormGroup;
  isSubmitting = false;
  message = '';

  constructor() {
    this.configForm = this.fb.group({
      companyName: ['', Validators.required],
      supportEmail: ['', [Validators.required, Validators.email]],
      currency: ['EUR', Validators.required],
      maintenanceMode: [false]
    });
  }

  ngOnInit(): void {
    this.systemService.getSystemConfig().subscribe(config => {
      this.configForm.patchValue(config);
    });
  }

  onSubmit(): void {
    if (this.configForm.valid) {
      this.isSubmitting = true;
      this.message = '';
      this.systemService.updateSystemConfig(this.configForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.message = 'Paramètres globaux enregistrés avec succès !';
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error(err);
        }
      });
    }
  }
}
