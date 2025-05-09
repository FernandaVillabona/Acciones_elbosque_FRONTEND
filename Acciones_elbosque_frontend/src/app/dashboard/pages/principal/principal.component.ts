import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../services/users/users.service';
import { CurrencyPipe } from '@angular/common';

import { DashboardUsuarioDTO, Holding, Operacion, Orden, Usuario } from '../../../models/usuario';



@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule ],
  providers: [CurrencyPipe],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  currentTime: string = '';
  location: string = 'Cargando ubicación...';
  valorPortafolio: number = 0;
  holdings: any[] = [];
  operaciones: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getLocation();
    this.updateClock();
    this.loadDashboardData();
  }

  updateClock(): void {
    this.currentTime = new Date().toLocaleTimeString();
  }

  getLocation(): void {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        this.location = `${data.city}, ${data.country_name}`;
      })
      .catch(() => {
        this.location = 'Ubicación desconocida';
      });
  }
    loadDashboardData(): void {
  const userId = localStorage.getItem('userId');
  if (userId) {
    this.userService.getDashboardUsuarioData(+userId).subscribe({
      next: (dashboardData: DashboardUsuarioDTO) => {
        this.valorPortafolio = dashboardData.valorPortafolio;
        this.holdings = dashboardData.holdings;
        this.operaciones = this.mapOrdenesToOperaciones(dashboardData.operaciones); // Mapeo aquí
      },
      error: (err) => {
        console.error('Error cargando los datos del dashboard:', err);
      }
    });
  }
}

// Método para mapear las órdenes a operaciones
mapOrdenesToOperaciones(ordenes: Orden[]): any[] {
  return ordenes.map(orden => ({
    tipo: orden.tipo_orden === 'market_order' ? 'Compra' : 'Venta', // Tipo de orden (puedes ajustar esto si es necesario)
    fecha: orden.fecha_creacion // Fecha de la orden
  }));
}


}