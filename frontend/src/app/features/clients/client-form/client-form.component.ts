import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../client.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-form',
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
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Modifier le Client' : 'Ajouter un Client' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Nom de l'entreprise / Société</mat-label>
              <input matInput formControlName="companyName" required>
              <mat-error *ngIf="clientForm.get('companyName')?.hasError('required')">
                Le nom de l'entreprise est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Nom du contact</mat-label>
              <input matInput formControlName="contactName" required>
              <mat-error *ngIf="clientForm.get('contactName')?.hasError('required')">
                Le nom du contact est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="clientForm.get('email')?.hasError('required')">
                L'email est requis
              </mat-error>
              <mat-error *ngIf="clientForm.get('email')?.hasError('email')">
                Format d'email invalide
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Téléphone</mat-label>
              <input matInput formControlName="phone">
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Adresse</mat-label>
              <textarea matInput formControlName="address" rows="3"></textarea>
            </mat-form-field>

            <div class="info-note" *ngIf="!isEditMode">
              ℹ️ Un compte utilisateur <strong>ROLE_CLIENT</strong> sera automatiquement créé pour ce client.<br>
              <strong>Mot de passe temporaire :</strong> <code>client123</code> (avec changement obligatoire à la première connexion).
            </div>

            <div class="actions">
              <button mat-button type="button" (click)="cancel()">Annuler</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="clientForm.invalid || isLoading">
                {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
    .form-card {
      width: 100%;
      max-width: 600px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 15px;
    }
    .info-note {
      background-color: #e3f2fd;
      color: #0d47a1;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 15px;
      font-size: 14px;
    }
  `]
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clientForm: FormGroup;
  isEditMode = false;
  clientId: number | null = null;
  isLoading = false;

  constructor() {
    this.clientForm = this.fb.group({
      companyName: ['', Validators.required],
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clientId = +id;
      this.clientService.getClient(this.clientId).subscribe(client => {
        this.clientForm.patchValue(client);
      });
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const clientData = this.clientForm.value;

      if (this.isEditMode && this.clientId) {
        this.clientService.updateClient(this.clientId, clientData).subscribe({
          next: () => this.router.navigate(['/clients']),
          error: (err) => {
            this.isLoading = false;
            console.error(err);
          }
        });
      } else {
        this.clientService.createClient(clientData).subscribe({
          next: () => this.router.navigate(['/clients']),
          error: (err) => {
            this.isLoading = false;
            console.error(err);
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/clients']);
  }
}
