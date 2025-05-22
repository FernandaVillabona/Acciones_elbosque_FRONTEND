import {Component, NgIterable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CurrencyPipe, DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-pages',
  imports: [
    NgClass,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './pages.component.html',
  standalone: true,
  styleUrl: './pages.component.css'
})
export class PagesComponent {
  constructor(private http: HttpClient) {}


  cargarOperaciones(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`http://localhost:8080/api/alpaca/operaciones-ejecutadas`, { headers }).subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', JSON.stringify(data, null, 2));
        this.operaciones = data;
      },
      error: (err) => {
        console.error('Error al cargar operaciones:', err);
      }
    });
  }


}
