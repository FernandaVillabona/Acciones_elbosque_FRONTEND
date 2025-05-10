import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PaginaInicioComponent } from './pagina-inicio/pagina-inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { LayoutComponent } from './dashboard/layout/layout.component';
import { AuthGuard } from './guards/auth.guard'; // 👈 Asegúrate de importar el guard

export const routes: Routes = [
  { path: '', component: PaginaInicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [AuthGuard], // 👈 Protege acceso
    children: [
      { path: '', redirectTo: 'principal', pathMatch: 'full' },
      {
        path: 'principal',
        loadComponent: () =>
          import('./dashboard/pages/principal/principal.component').then(m => m.PrincipalComponent)
      },
      {
        path: 'operaciones',
        loadComponent: () =>
          import('./dashboard/pages/operaciones/operaciones.component').then(m => m.OperacionesComponent)
      },
      {
        path: 'mercado',
        loadComponent: () =>
          import('./dashboard/pages/mercado/mercado.component').then(m => m.MercadoComponent)
      },
 
    ]
  }
];