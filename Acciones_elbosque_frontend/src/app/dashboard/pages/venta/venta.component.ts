import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-venta',
  imports: [
    NgForOf
  ],
  templateUrl: './venta.component.html',
  standalone: true,
  styleUrl: './venta.component.css'
})
export class VentaComponent {
  accionesHold : any[] = [];

  ngOnInit(): void {
    this.cargarOperaciones();
  }

  constructor(private http: HttpClient) {}


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

}
