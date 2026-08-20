import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'change-password',
    loadComponent: () => import('./features/auth/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [authGuard]
  },
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
      {
        path: 'clients',
        canActivate: [roleGuard],
        data: { expectedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/clients/client-list/client-list.component').then(m => m.ClientListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
          }
        ]
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { expectedRoles: ['ROLE_SUPER_ADMIN'] },
        loadComponent: () => import('./features/admin/user-management/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'system-config',
        canActivate: [roleGuard],
        data: { expectedRoles: ['ROLE_SUPER_ADMIN'] },
        loadComponent: () => import('./features/admin/system/system-config.component').then(m => m.SystemConfigComponent)
      },
      {
        path: 'monitoring',
        canActivate: [roleGuard],
        data: { expectedRoles: ['ROLE_SUPER_ADMIN'] },
        loadComponent: () => import('./features/admin/system/monitoring.component').then(m => m.MonitoringComponent)
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
