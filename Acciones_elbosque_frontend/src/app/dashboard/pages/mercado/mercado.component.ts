import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mercado',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './mercado.component.html',
  styleUrls: ['./mercado.component.scss']
})
export class MercadoComponent implements OnInit {
  currentTime: string = '';
  location: string = 'Bogotá, CO'; // Puedes hacer esto dinámico más adelante

  marketStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 185.23,
      change: 1.52,
      volume: 1203450
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 2780.45,
      change: -0.86,
      volume: 954300
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 132.18,
      change: 0.21,
      volume: 803210
    }
    // Aquí irían más resultados de la API Alpaca
  ];

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000); // actualizar cada minuto
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  comprar(stock: any): void {
    alert(`Comprando acciones de ${stock.symbol}`);
  }

  vender(stock: any): void {
    alert(`Vendiendo acciones de ${stock.symbol}`);
  }
}
