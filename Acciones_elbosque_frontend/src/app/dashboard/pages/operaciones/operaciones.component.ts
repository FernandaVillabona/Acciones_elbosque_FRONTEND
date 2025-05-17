import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.scss']
})
export class OperacionesComponent implements OnInit {
  operaciones: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarOperaciones();
  }

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