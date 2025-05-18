import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule],
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
  nombreCompleto = 'Usuario';
  valorTotalHoldings: number = 0;
  mostrarEnCOP: boolean = false;

  ngOnInit(): void {
    this.getLocation();
    this.updateClock();
    this.loadOrdenesPendientes();
    this.loadOrdenesEjecutadas();
  }

  getSaludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  getMensajePortafolio(): string {
    if (this.holdings && this.holdings.length > 0) {
      return 'Revisa tus órdenes pendientes y las operaciones recientes.';
    } else {
      return 'Aún no tienes acciones registradas. ¡Empieza a invertir hoy!';
    }
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

  // 🔽 Cargar órdenes no ejecutadas
  loadOrdenesPendientes(): void {
    fetch('http://localhost:8080/api/alpaca/ordenes-pendientes')
      .then(res => res.json())
      .then(data => {
        this.holdings = data || [];
        this.valorTotalHoldings = this.holdings.reduce(
          (total, item) => total + (item.valor || 0),
          0
        );
      })
      .catch(err => {
        console.error('Error cargando órdenes pendientes:', err);
      });
  }

  // 🔽 Cargar órdenes ejecutadas
  loadOrdenesEjecutadas(): void {
    fetch('http://localhost:8080/api/alpaca/ordenes-ejecutadas')
      .then(res => res.json())
      .then(data => {
        this.operaciones = data.map((op: any) => ({
          ...op,
          tipo: op.tipo === 'market' ? 'Compra' : 'Venta'
        }));
      })
      .catch(err => {
        console.error('Error cargando órdenes ejecutadas:', err);
      });
  }

  alternarMoneda(): void {
    this.mostrarEnCOP = !this.mostrarEnCOP;
  }
}
