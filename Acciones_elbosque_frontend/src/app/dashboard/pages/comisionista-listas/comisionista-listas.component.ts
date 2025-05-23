import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlpacaService} from '../../../services/alpaca.service';
import {NgForOf} from '@angular/common';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-comisionista-listas',
  imports: [
    NgForOf
  ],
  templateUrl: './comisionista-listas.component.html',
  standalone: true,
  styleUrl: './comisionista-listas.component.css'
})
export class ComisionistaListasComponent {
  comisionistas : any[] = [];
  idSeleccionado: any;

  constructor(private http: HttpClient ,private alpaca: AlpacaService ) {}

  ngOnInit(): void {
    this.cargarOperaciones();
  }



  cargarOperaciones(): void {
    const token = localStorage.getItem('token');
    const idUsuario = Number(localStorage.getItem('idUsuario'));

    console.log("dsadsadsa"+token)
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`http://localhost:8080/usuarios/listadoUsuarios?idUsuarioLogeado=${idUsuario}`, { headers }).subscribe({next: (data) => {
        console.log('Datos recibidos del backend:', JSON.stringify(data, null, 2));
        this.comisionistas = data;
      },
      error: (err) => {
        console.error('Error al cargar operaciones:', err);
      }
    });
  }



  seleccionarComisionista(idSeleccionado: any) {

    idSeleccionado.print();

  }
}
