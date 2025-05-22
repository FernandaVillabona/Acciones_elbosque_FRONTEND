import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-tv-chart',
  standalone: true,
  template: `<div [id]="containerId" style="width: 100%; height: 500px;"></div>`,
})
export class TvChartComponent implements OnInit, AfterViewInit {
  @Input() symbol!: string;
  containerId!: string;

  ngOnInit(): void {
    this.containerId = `tv-chart-${this.symbol}`;
  }

  ngAfterViewInit(): void {
    // Espera un ciclo de render para asegurarse de que el div ya existe
    setTimeout(() => {
      if (!(window as any).TradingView) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => this.createChart();
        document.body.appendChild(script);
      } else {
        this.createChart();
      }
    });
  }

  private createChart() {
    new (window as any).TradingView.widget({
      container_id: this.containerId,
      symbol: `NASDAQ:${this.symbol}`,
      interval: 'D',
      width: '100%',
      height: 500,
      theme: 'dark',
      style: 1,
      locale: 'es',
      toolbar_bg: '#1c1f2c',
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
    });
  }
}