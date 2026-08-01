import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ isEditMode ? 'Modifier Employé' : 'Ajouter Employé' }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="form-container">
          
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="firstName" required>
          </mat-form-field>
          
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="lastName" required>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Département</mat-label>
            <input matInput formControlName="department">
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Poste</mat-label>
            <input matInput formControlName="position">
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Date d'embauche</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="hireDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <div class="actions">
            <button mat-button type="button" (click)="onCancel()">Annuler</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="employeeForm.invalid || isLoading">
              Sauvegarder
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      padding-top: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  employeeForm: FormGroup;
  isEditMode = false;
  employeeId?: number;
  isLoading = false;

  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: [''],
      position: [''],
      hireDate: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployeeData(this.employeeId);
    }
  }

  loadEmployeeData(id: number): void {
    this.employeeService.getEmployee(id).subscribe(employee => {
      this.employeeForm.patchValue(employee);
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const employeeData = this.employeeForm.value;

      const request = this.isEditMode && this.employeeId
        ? this.employeeService.updateEmployee(this.employeeId, employeeData)
        : this.employeeService.createEmployee(employeeData);

      request.subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error saving employee', err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}
