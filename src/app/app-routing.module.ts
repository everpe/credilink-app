import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/credits',
        pathMatch: 'full',
      },
      // {
      //   path: 'dashboard',
      //   canActivate: [authGuard],
      //   loadChildren: () =>
      //     import('./pages/pages.module').then((m) => m.PagesModule),
      // },
      {
        path: 'clients',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/clients/list/list.component').then(m => m.ListComponent)  // Lazy loading de componente standalone
      },
      {
        path: 'codebtors',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/co-debtors/list/list.component').then(m => m.ListComponent)  // Lazy loading de componente standalone
      },
      {
        path: 'credits',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/credits/credits.component').then(m => m.CreditsComponent)  
      },
      {
        path: 'users',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)  
      },
      {
        path: 'companies',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent)  
      },
      {
        path: 'sedes',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/sedes/sedes.component').then(m => m.SedesComponent)  
      },
      {
        path: 'move/sede',
        canActivate: [authGuard,adminGuard],
        loadComponent: () => import('./pages/sedes/move-sede/move-sede.component').then(m => m.MoveSedeComponent)  
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: '**',  
    redirectTo: '/credits',  
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
