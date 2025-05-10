import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-mercado',
  standalone: true,
  templateUrl: './mercado.component.html',
  styleUrls: ['./mercado.component.scss'],
  imports: [CommonModule,StockChartComponent] // ⬅️ esto es lo que faltaba
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

  constructor(private alpaca: AlpacaService,   private sanitizer: DomSanitizer
) {}

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
}
