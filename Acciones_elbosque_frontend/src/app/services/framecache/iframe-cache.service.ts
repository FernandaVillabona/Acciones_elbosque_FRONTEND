// src/app/services/iframe-cache.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IframeCacheService {
  private chartUrls: { [symbol: string]: string } = {};

  getChartUrl(symbol: string): string {
    if (!this.chartUrls[symbol]) {
      const tvSymbol = `NASDAQ:${symbol.toUpperCase()}`;
      this.chartUrls[symbol] =
        `https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbol=${tvSymbol}&locale=es&dateRange=1D&colorTheme=dark&autosize=true`;
    }
    return this.chartUrls[symbol];
  }
}
