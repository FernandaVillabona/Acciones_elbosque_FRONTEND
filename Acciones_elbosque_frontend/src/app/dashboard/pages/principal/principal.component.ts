import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule], // 👈 necesario para usar ngClass, ngIf, ngFor, etc.
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})

export class PrincipalComponent implements OnInit {
  currentTime: string = '';
  location: string = 'Cargando ubicación...';

  holdings = [
    { accion: 'AAPL', cantidad: 10, precio: '$150', valor: '$1500' },
    { accion: 'GOOGL', cantidad: 5, precio: '$2800', valor: '$14000' },
    { accion: 'AMZN', cantidad: 3, precio: '$3300', valor: '$9900' },
    { accion: 'MSFT', cantidad: 8, precio: '$300', valor: '$2400' },
    { accion: 'TSLA', cantidad: 6, precio: '$700', valor: '$4200' },
    { accion: 'NFLX', cantidad: 4, precio: '$400', valor: '$1600' },
    { accion: 'NVDA', cantidad: 7, precio: '$650', valor: '$4550' }
  ];
  
  operaciones = [
    { accion: 'MSFT', tipo: 'compra', fecha: '2025-04-20' },
    { accion: 'TSLA', tipo: 'venta', fecha: '2025-04-25' },
    { accion: 'AAPL', tipo: 'compra', fecha: '2025-04-15' },
    { accion: 'GOOGL', tipo: 'venta', fecha: '2025-04-18' },
    { accion: 'AMZN', tipo: 'compra', fecha: '2025-04-22' },
    { accion: 'NVDA', tipo: 'compra', fecha: '2025-04-26' },
    { accion: 'NFLX', tipo: 'venta', fecha: '2025-04-27' }
  ];
  ngOnInit(): void {
    this.getLocation();
    this.updateClock();
  }
  updateClock(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
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
}