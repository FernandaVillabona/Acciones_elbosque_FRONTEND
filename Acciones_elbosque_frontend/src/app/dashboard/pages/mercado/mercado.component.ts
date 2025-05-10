import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlpacaService } from '../../../services/alpaca.service';
import { CommonModule } from '@angular/common'; 
import { StockChartComponent } from '../../graficos/stock-chart/stock-chart.component';
import {
  AlpacaAsset,
  AlpacaQuote,
  AlpacaPosition,
  AccountBalance
} from '../../../models/alpaca';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalCompraComponent } from "../modals/modal-compra/modal-compra.component";
declare var bootstrap: any; // Declare bootstrap globally

@Component({
  selector: 'app-mercado',
  standalone: true,
  templateUrl: './mercado.component.html',
  styleUrls: ['./mercado.component.scss'],
  imports: [CommonModule, StockChartComponent, ModalCompraComponent] // ⬅️ esto es lo que faltaba
 // ⬅️ esto es lo que faltaba
})


export class MercadoComponent implements OnInit {
  loading = true;
  uiMessage: string | null = null;

  balance?: AccountBalance;
  assets: AlpacaAsset[] = [];
  quote?: AlpacaQuote;
  positions: AlpacaPosition[] = [];

  selectedSymbol: string | null = null;
  selectedCandles: any[] = [];

   symbolSeleccionado: string = '';
  cantidad: number = 1;
  

@ViewChild(ModalCompraComponent) modalCompra!: ModalCompraComponent;

  constructor(private alpaca: AlpacaService,   private sanitizer: DomSanitizer
) {}

abrirModalCompra(symbol: string): void {
  this.symbolSeleccionado = symbol;
  this.cantidad = 1;

  const modalElement = document.getElementById('modalCompra');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement); // Corrected 'boostrap' to 'bootstrap'
    modalInstance.show();
  }
}

onConfirmarCompra(cantidad: number): void {
  const idUsuario = Number(localStorage.getItem('idUsuario'));
  if (!idUsuario || cantidad < 1) {
    alert('Datos inválidos');
    return;
  }

  this.alpaca.placeMarketOrder(this.symbolSeleccionado, cantidad, 'buy', idUsuario).subscribe({
    next: (res) => {
      alert(`✅ Compra de ${cantidad} ${this.symbolSeleccionado} exitosa.`);
    },
    error: (err) => {
      alert('❌ Error en la compra');
      console.error(err);
    }
  });
}


  ngOnInit(): void {
    this.loadAlpacaData();
  }

  private loadAlpacaData(): void {
  this.loading = true;
  this.uiMessage = null;

  const symbolsPermitidos = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD', 'INTC', 'NFLX'];

  Promise.all([
    this.alpaca.getBalance().toPromise(),
    this.alpaca.getAssets().toPromise(),
    this.alpaca.getQuote('AAPL').toPromise(),
    this.alpaca.getPositions().toPromise()
  ])
  .then(([balance, assets, quote, positions]) => {
    this.balance = balance;
    this.assets = (assets || []).filter(a => symbolsPermitidos.includes(a.symbol));
    this.quote = quote;
    this.positions = positions || [];
  })
  .catch(error => {
    console.error('Error cargando datos de Alpaca:', error);
    this.uiMessage = error.message || 'Error al cargar datos del mercado';
  })
  .finally(() => {
    this.loading = false;
  });
}
  loadChart(symbol: string): void {
    const today = new Date();
    const start = new Date(today);
    start.setMonth(today.getMonth() - 3);

    const startStr = start.toISOString().split('T')[0];
    const endStr = today.toISOString().split('T')[0];

    this.alpaca.getHistoricalData(symbol, '1D', startStr, endStr).subscribe({
      next: (data) => {
        this.selectedCandles = data;
        this.selectedSymbol = symbol;
      },
      error: (err) => {
        console.error(`Error cargando velas para ${symbol}:`, err);
      }
    });
  }

  getChartUrl(symbol: string): SafeResourceUrl {
  const tvSymbol = `NASDAQ:${symbol.toUpperCase()}`;
  const url = `https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbol=${tvSymbol}&locale=es&dateRange=1D&colorTheme=dark&autosize=true`;
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

comprarActivo(symbol: string) {
  const idUsuario = Number(localStorage.getItem('idUsuario'));
  if (!idUsuario) {
    alert('Usuario no autenticado');
    return;
  }

  const qty = 1; // o pedirlo mediante input/modal
  const side: 'buy' = 'buy';

  this.loading = true;
  this.alpaca.placeMarketOrder(symbol, qty, side, idUsuario).subscribe({
    next: (msg) => {
      this.uiMessage = '';
      this.loading = false;
      alert(`✅ Compra exitosa: ${msg}`);
      // Opcional: actualizar balance o posiciones aquí
    },
    error: (err) => {
      this.loading = false;
      console.error('Error al comprar activo:', err);
      this.uiMessage = 'Error al procesar la compra';
    }
  });
}
}
