import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonModule, NgForOf} from '@angular/common';
import {AlpacaService} from '../../../services/alpaca.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-venta',
  imports: [CommonModule,
    NgForOf
  ],
  templateUrl: './venta.component.html',
  standalone: true,
  styleUrl: './venta.component.scss'
})
export class VentaComponent {
  accionesHold : any[] = [];
  ngOnInit(): void {
    this.cargarOperaciones();
  }

  constructor(private http: HttpClient ,private alpaca: AlpacaService) {}


  cargarOperaciones(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`http://localhost:8080/api/alpaca/positions`, { headers }).subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', JSON.stringify(data, null, 2));
        this.accionesHold = data;
      },
      error: (err) => {
        console.error('Error al cargar operaciones:', err);
      }
    });
  }

  onRealizarVenta(symbol: string, cantidad: number, time: string): void {

    //const idUsuario = Number(localStorage.getItem('idUsuario'));
    if (cantidad < 1) {
      alert('Datos inválidos');
      return;
    }

    this.alpaca.placeMarketOrderSell(symbol, cantidad, 'sell', time).subscribe({
      next: (res) => {
        alert(`✅ Venta de ${cantidad} ${symbol} exitosa.`);
      },
      error: (err) => {
  const mensaje = err?.error;

  // Verifica si es un rechazo de Alpaca por wash trade
  if (mensaje && typeof mensaje === 'string' && mensaje.includes('wash trade')) {
    alert('🚫 No se puede ejecutar esta orden: ya existe una orden opuesta activa (wash trade detectado). Por favor, cancela la orden opuesta primero.');
  } else {
    alert('❌ Error al realizar la venta. Intenta más tarde.');
  }

  console.error('Detalles del error:', err);
}
      
    });
  }

}
