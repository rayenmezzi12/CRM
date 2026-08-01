import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'employees',
        canActivate: [roleGuard],
        data: { expectedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
          }
        ]
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
