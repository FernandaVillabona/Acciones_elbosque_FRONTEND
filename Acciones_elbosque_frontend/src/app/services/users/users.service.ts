import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  // Registro de usuario
  registrarUsuario(usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/registroUsuario`, usuario, { headers });
  }

  // Login de usuario
  login(email: string, contrasena: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/login`, { email, contrasena }, { responseType: 'text' });
  }

  // Obtener usuario por ID
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Listar todos los usuarios
  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listar`);
  }
  verificarCodigoOTP(email: string, codigoOtp: string): Observable<string> {
    const body = { email, codigoOtp };
    return this.http.post('http://localhost:8080/auth/mfa/verificar', body, { responseType: 'text' });
  }
}