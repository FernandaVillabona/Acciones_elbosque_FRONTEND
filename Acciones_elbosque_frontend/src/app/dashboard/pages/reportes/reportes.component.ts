import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Chart from 'chart.js/auto';

interface PortafolioResumen {
  accion: string;
  porcentaje_ganancia: number;
  precio_promedio: number;
  cantidad: number;
  valor_actual: number;
}

interface DistribucionPortafolio {
  accion: string;
  porcentaje: number;
}

interface OrdenPorTipo {
  tipo: string;
  cantidad: number;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit, AfterViewInit {
  resumen: PortafolioResumen[] = [];
  distribucion: DistribucionPortafolio[] = [];
  chart: any;
  pieChart: any;
  ordenesPorTipo: OrdenPorTipo[] = [];
  ordenesChart: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Gráfico de barras
    this.http.get<PortafolioResumen[]>('http://localhost:8080/api/alpaca/resumen-portafolio')
      .subscribe({
        next: (data) => {
          this.resumen = data;
          this.renderChart();
        },
        error: (err) => console.error('Error al obtener resumen:', err)
      });

    // Gráfico de pastel
    this.http.get<DistribucionPortafolio[]>('http://localhost:8080/api/alpaca/portafolio/distribucion')
      .subscribe({
        next: (data) => {
          this.distribucion = data;
          this.renderPieChart();
        },
        error: (err) => console.error('Error al obtener distribución:', err)
      });

    // Órdenes por tipo
    this.http.get<OrdenPorTipo[]>('http://localhost:8080/api/alpaca/ordenes/por-tipo')
      .subscribe({
        next: (data) => {
          this.ordenesPorTipo = data;
          this.renderOrdenesChart();
        },
        error: (err) => console.error('Error al obtener órdenes por tipo:', err)
      });
  }

  ngAfterViewInit(): void {
    // Si los datos llegan después, renderChart se llama desde ngOnInit
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const labels = this.resumen.map(item => item.accion);
    const data = this.resumen.map(item => item.porcentaje_ganancia);
    const backgroundColors = data.map(val => val >= 0 ? '#4CAF50' : '#F44336');

    const ctx = document.getElementById('barCanvas') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Porcentaje de Ganancia (%)',
            data,
            backgroundColor: backgroundColors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Ganancia (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Acciones'
              }
            }
          }
        }
      });
    }
  }

  renderPieChart() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    const labels = this.distribucion.map(item => item.accion);
    const data = this.distribucion.map(item => item.porcentaje);
    const backgroundColors = [
      '#43a047', // verde
      '#e53935', // rojo
      '#1976d2', // azul
      '#8e24aa', // violeta
      '#00bcd4', // celeste
      '#f4511e', // naranja fuerte
      '#3949ab', // azul oscuro
      '#c0ca33', // verde lima
      '#6d4c41', // marrón
    ];

    const ctx = document.getElementById('pieCanvas') as HTMLCanvasElement;
    if (ctx) {
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: 'Distribución (%)',
            data,
            backgroundColor: backgroundColors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: 'bottom' },
            tooltip: { enabled: true }
          }
        }
      });
    }
  }

  renderOrdenesChart() {
    if (this.ordenesChart) {
      this.ordenesChart.destroy();
    }
    const labels = this.ordenesPorTipo.map(item => item.tipo);
    const data = this.ordenesPorTipo.map(item => item.cantidad);
    const backgroundColors = [
      '#1976d2', // azul
      '#43a047', // verde
      '#e53935', // rojo
      '#8e24aa', // violeta
      '#00bcd4', // celeste
      '#f4511e', // naranja fuerte
    ];

    const ctx = document.getElementById('ordenesCanvas') as HTMLCanvasElement;
    if (ctx) {
      this.ordenesChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Cantidad de Órdenes',
            data,
            backgroundColor: backgroundColors
          }]
        },
        options: {
          indexAxis: 'y', // barras horizontales
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          },
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Tipo de Orden'
              }
            }
          }
        }
      });
    }
  }
}
