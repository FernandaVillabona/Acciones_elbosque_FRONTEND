import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/users/users.service'; // ajusta la ruta si es diferente
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  usuario?: Usuario;

  menu = [
    { icon: 'bi-calendar', label: 'Dashboard Principal' },
    { icon: 'bi-currency-dollar', label: 'Operaciones' },
    { icon: 'bi-graph-up-arrow', label: 'Mercado y Análisis' },
    { icon: 'bi-tools', label: 'Gestión de Perfil' },
    { icon: 'bi-person-badge', label: 'Comisionista' },
    { icon: 'bi-journal-text', label: 'Reportes y Finanzas' }
  ];

  constructor(
    private router: Router,
    private userService: UserService // ✅ inyectado correctamente
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.obtenerUsuarioPorId(+userId).subscribe({
        next: (user) => {
          this.usuario = user;
        },
        error: (err) => {
          console.error('Error cargando usuario:', err);
        }
      });
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
