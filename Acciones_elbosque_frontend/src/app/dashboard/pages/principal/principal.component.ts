import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UserService } from '../../../services/users/users.service';
import { AlpacaService } from '../../../services/alpaca.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { FormsModule } from '@angular/forms';

interface PortfolioSnapshot {
  equity: number;
  cash: number;
  buying_power: number;
  daily_change: number;
  historical_equity: {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
}

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NgChartsModule,FormsModule],
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
  closedPositions: any[] = [];
assets: any[] = [];
filteredAssets: any[] = [];
search = '';
  portfolioSnapshot: PortfolioSnapshot | null = null;
positions: any[] = [];
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { display: true },
      y: { display: true }
    }
  };

  constructor(
    private userService: UserService,
    private alpacaService: AlpacaService
  ) {}

ngOnInit(): void {
  this.getLocation();
  this.updateClock();
  this.loadNombre();
  this.loadOrdenesPendientes();
  this.loadOrdenesEjecutadas();

  // 🔹 Snapshot del portafolio
  this.alpacaService.getPortfolioSnapshot().subscribe({
    next: (data: PortfolioSnapshot) => {
      this.portfolioSnapshot = data;
      console.log('📊 Snapshot recibido:', data);

      const candles = data.historical_equity || [];

      const labels = candles.map(c =>
        new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      const values = candles.map(c => c.close);

      this.chartData = {
        labels,
        datasets: [
          {
            data: values,
            label: 'Equity Diario',
            fill: true,
            tension: 0.4,
            borderColor: '#0CA77D',
            backgroundColor: 'rgba(12, 167, 125, 0.2)',
            pointRadius: 0,
            pointHoverRadius: 0
          }
        ]
      };
    },
    error: err => {
      console.error('❌ Error al obtener snapshot:', err);
    }
  });

  // 🔹 Cargar activos disponibles
   this.alpacaService.getPositions().subscribe({
    next: (data) => {
      this.positions = data;
    },
    error: (err) => {
      console.error('❌ Error al cargar posiciones:', err);
    }
  });

  this.alpacaService.getClosedPositions().subscribe({
    next: (data) => {
      this.closedPositions = data;
    },
    error: (err) => {
      console.error('Error al obtener posiciones cerradas:', err);
    }
  });
}


  loadNombre(): void {
    const idUsuario = localStorage.getItem('idUsuario');
    if (idUsuario) {
      this.userService.getDashboardData(+idUsuario).subscribe({
        next: data => {
          this.nombreCompleto = `${data.nombre} ${data.apellido}`;
        },
        error: err => {
          console.error('Error obteniendo nombre del usuario:', err);
        }
      });
    }
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

  loadOrdenesPendientes(): void {
    fetch('http://localhost:8080/api/alpaca/ordenes-pendientes')
      .then(res => res.json())
      .then(data => {
        this.holdings = (data || []).map((orden: any) => {
          const cantidad = orden.qty || orden.cantidad || 0;
          const precio = orden.precio || orden.precioActual || 0;
          const valor = cantidad * precio;

          return {
            accion: orden.symbol || orden.accion,
            tipoOrden: this.mapOrderType(orden.type || orden.tipo),
            estado: this.mapOrderStatus(orden.status || orden.estado),
            cantidad,
            valor,
            id: orden.id || orden.orderId
          };
        });

        this.valorTotalHoldings = this.holdings.reduce(
          (total, item) => total + (item.valor || 0),
          0
        );
      })
      .catch(err => {
        console.error('Error cargando órdenes pendientes:', err);
      });
  }

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

  mapOrderType(type: string): string {
    switch (type) {
      case 'market': case 'market_order': return 'Market';
      case 'limit': case 'limit_order': return 'Limit';
      case 'stop': case 'stop_loss_order': return 'Stop Loss';
      case 'take_profit': case 'take_profit_order': return 'Take Profit';
      default: return type || 'Desconocido';
    }
  }

  mapOrderStatus(status: string): string {
    switch (status) {
      case 'new': return 'Pendiente';
      case 'accepted': return 'Pendiente';
      case 'filled': return 'Ejecutada';
      case 'canceled': return 'Cancelada';
      default: return status || 'Desconocido';
    }
  }

  get dailyChangeClass(): string {
    const value = this.portfolioSnapshot?.daily_change;
    if (value === undefined) return '';
    return value > 0 ? 'text-success' : value < 0 ? 'text-danger' : '';
  }

  filtrarAssets(): void {
  const term = this.search.toLowerCase();
  this.filteredAssets = this.assets.filter(asset =>
    asset.symbol.toLowerCase().includes(term) ||
    asset.name?.toLowerCase().includes(term)
  );
}


}