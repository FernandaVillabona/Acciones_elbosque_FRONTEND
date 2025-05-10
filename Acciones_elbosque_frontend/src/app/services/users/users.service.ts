import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario'; // Correct relative path

interface OtpResponse {
  token: string;
  idUsuario: number;
}


@Injectable({
  providedIn: 'root'
})



export class UserService {
  private baseUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  // Registro de usuario
registrarUsuario(usuario: Usuario): Observable<string> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post('http://localhost:8080/usuarios/registroUsuario', usuario, {
    headers,
    responseType: 'text' // ✅ esta línea es clave
  });
}
  // Login de usuario (envía OTP)
  login(email: string, contrasena: string): Observable<string> {
    return this.http.post('http://localhost:8080/auth/login', { email, contrasena }, { responseType: 'text' });
  }

verificarOtp(payload: { email: string, codigoOtp: string }): Observable<{ token: string; idUsuario: number }> {
  return this.http.post<{ token: string; idUsuario: number }>(
    'http://localhost:8080/auth/mfa/verificar',
    payload // ❌ NO pongas responseType aquí
  );
}
  // Obtener usuario por ID (con modelo tipado)
  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
  return this.http.get<Usuario>(`http://localhost:8080/usuarios/${id}`);
}

  // Listar todos los usuarios
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/listar`);
  }
getDashboardData(id: number): Observable<any> {
  return this.http.get<any>(`http://localhost:8080/usuarios/${id}`);
}



}