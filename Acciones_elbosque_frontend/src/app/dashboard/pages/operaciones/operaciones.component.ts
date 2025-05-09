import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
    const userId = localStorage.getItem('userId'); // o recuperar desde JWT si lo manejas
    this.http.get<any[]>(`http://localhost:8080/operaciones/usuario/${userId}`).subscribe({
      next: (data) => {
        this.operaciones = data;
      },
      error: (err) => {
        console.error('Error al cargar operaciones:', err);
      }
    });
  }
}