import {Component, OnInit, ViewChild} from '@angular/core';
import {AlpacaService} from '../../../services/alpaca.service';
import {CommonModule} from '@angular/common';
import {StockChartComponent} from '../../graficos/stock-chart/stock-chart.component';
import {AccountBalance, AlpacaAsset, AlpacaPosition, AlpacaQuote} from '../../../models/alpaca';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ModalCompraComponent} from "../modals/modal-compra/modal-compra.component";
import { TvChartComponent } from '../../components/tv-chart/tv-chart.component';
import { IframeCacheService } from '../../../services/framecache/iframe-cache.service';
import { OrderService } from '../../../services/orden.service';


declare var bootstrap: any; // Declare bootstrap globally

@Component({
  selector: 'app-mercado',
  standalone: true,
  templateUrl: './mercado.component.html',
  styleUrls: ['./mercado.component.scss'],
  imports: [CommonModule, StockChartComponent, ModalCompraComponent, TvChartComponent] // ⬅️ esto es lo que faltaba
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

  

  symbolsPermitidos: string[] = [
  'AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN',
  'META', 'NVDA', 'AMD', 'INTC', 'NFLX'
];
symbolChartUrls: { [symbol: string]: SafeResourceUrl } = {};
  symbolSeleccionado: string = '';
  cantidad: number = 1;
symbolCandlestickUrls: { [symbol: string]: SafeResourceUrl } = {};
symbolPrices: { [symbol: string]: number } = {};
  viewMode: 'mini' | 'candlestick' = 'mini';


  chartUrl: SafeResourceUrl | null = null;

  @ViewChild(ModalCompraComponent) modalCompra!: ModalCompraComponent;

  constructor(   private orderService: OrderService, private iframeCache: IframeCacheService, private alpaca: AlpacaService, private sanitizer: DomSanitizer
  ) {
  }

  
abrirModalCompra(symbol: string): void {
  this.symbolSeleccionado = symbol;
  this.modalCompra.open();
}




ngOnInit(): void {
  this.loadAlpacaData();
}


  loadAlpacaData(): void {
  this.loading = true;
  this.uiMessage = null;

  const symbolsPermitidos = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD', 'INTC', 'NFLX'];

  Promise.all([
    this.alpaca.getBalance().toPromise(),
    this.alpaca.getAssets().toPromise(),
    this.alpaca.getPositions().toPromise()
  ])
    .then(([balance, assets, positions]) => {
      this.balance = balance;
      this.assets = (assets || []).filter(a => symbolsPermitidos.includes(a.symbol));
      this.positions = positions || [];

      // ✅ Aquí precalculas las URLs de gráfico mini
      this.assets.forEach(asset => {
        const url = `https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbol=NASDAQ:${asset.symbol}&locale=es&dateRange=1D&colorTheme=dark&autosize=true`;
        this.symbolChartUrls[asset.symbol] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      });

      // ✅ Aquí traes el precio actual por símbolo
      this.assets.forEach(asset => {
       this.alpaca.getQuote(asset.symbol).subscribe(quote => {
  // Puedes elegir cuál mostrar: el ask, el bid o el promedio
  const price = (quote.askPrice + quote.bidPrice) / 2; // 🧠 más realista
  this.symbolPrices[asset.symbol] = price;
});
      });
    })
    .catch(error => {
      console.error('Error cargando datos de Alpaca:', error);
      this.uiMessage = error.message || 'Error al cargar datos del mercado';
    })
    .finally(() => {
      this.loading = false;
    });
}

getChartUrl(symbol: string): SafeResourceUrl {
  const rawUrl = this.iframeCache.getChartUrl(symbol);
  return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
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

getCandlestickChartUrl(symbol: string): SafeResourceUrl {
  const tvSymbol = `NASDAQ:${symbol.toUpperCase()}`;
  const url = `https://s.tradingview.com/embed-widget/advanced-chart/?symbol=${tvSymbol}&interval=D&theme=dark&style=1&locale=es&autosize=false&width=700&height=700`;
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

onConfirmarCompra(orden: {
  symbol: string;
  qty: number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'take_profit';
  targetPrice?: number | null;
}): void {
  switch (orden.type) {
    case 'market':
      this.orderService.placeMarketOrder(orden.symbol, orden.qty, orden.side).subscribe({
        next: res => alert(`✅ Orden de mercado ejecutada: ${orden.symbol}`),
        error: err => alert('❌ Error ejecutando orden de mercado')
      });
      break;

    case 'limit':
      if (!orden.targetPrice) return alert('⚠️ Precio límite requerido');
      this.orderService.placeLimitOrder(orden.symbol, orden.qty, orden.targetPrice).subscribe({
        next: res => alert(`✅ Orden límite enviada: ${orden.symbol}`),
        error: err => alert('❌ Error en orden límite')
      });
      break;

    case 'stop':
      if (!orden.targetPrice) return alert('⚠️ Precio de stop requerido');
      this.orderService.placeStopLossOrder(orden.symbol, orden.qty, orden.side, orden.targetPrice).subscribe({
        next: res => alert(`✅ Stop loss enviado para ${orden.symbol}`),
        error: err => alert('❌ Error en orden stop loss')
      });
      break;

    case 'take_profit':
      if (!orden.targetPrice) return alert('⚠️ Precio de ganancia requerido');
      this.orderService.placeTakeProfitOrder(orden.symbol, orden.qty, orden.side, orden.targetPrice).subscribe({
        next: res => alert(`✅ Take profit enviado para ${orden.symbol}`),
        error: err => alert('❌ Error en orden take profit')
      });
      break;

    default:
      alert('❌ Tipo de orden no reconocido');
  }
}
}