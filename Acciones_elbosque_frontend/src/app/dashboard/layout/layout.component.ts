import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // ✅ incluye Router

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isCollapsed = false;

  menu = [
    { icon: 'bi-calendar', label: 'Dashboard Principal' },
    { icon: 'bi-currency-dollar', label: 'Operaciones' },
    { icon: 'bi-graph-up-arrow', label: 'Mercado y Análisis' },
    { icon: 'bi-tools', label: 'Gestión de Perfil' },
    { icon: 'bi-person-badge', label: 'Comisionista' },
    { icon: 'bi-journal-text', label: 'Reportes y Finanzas' }
  ];

  constructor(private router: Router) {} // ✅ inyectar Router

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    console.log('Logout clicked');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}