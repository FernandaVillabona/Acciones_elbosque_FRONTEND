import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../services/users/users.service';
import { OtpService } from '../services/otp/otp.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  requiresOtp = false;
  emailForOtp = '';
  codigoOtp = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private userService: UserService,
    private otpService: OtpService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    console.log('Intentando login con:', { email });

    this.userService.login(email, password).subscribe({
      next: (response: any) => {
        console.log('Login exitoso, respuesta:', response);
        if (typeof response === 'string') {
          // Si la respuesta es un string, probablemente sea el rol
          this.requiresOtp = true;
          this.emailForOtp = email;
          localStorage.setItem('temp_rol', response);
          alert('Se ha enviado un código de verificación a su correo electrónico');
        } else {
          // Si es un objeto, manejarlo según su estructura
          this.requiresOtp = true;
          this.emailForOtp = email;
          if (response.rol) {
            localStorage.setItem('temp_rol', response.rol);
          }
          alert('Se ha enviado un código de verificación a su correo electrónico');
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        if (err.status === 200) {
          // Si el status es 200 pero llegó como error, probablemente sea una respuesta válida
          const response = err.error;
          this.requiresOtp = true;
          this.emailForOtp = email;
          if (typeof response === 'string') {
            localStorage.setItem('temp_rol', response);
          } else if (response.rol) {
            localStorage.setItem('temp_rol', response.rol);
          }
          alert('Se ha enviado un código de verificación a su correo electrónico');
        } else {
          this.errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
        }
      }
    });
  }

  verificarOtp(): void {
    if (!this.codigoOtp || !this.emailForOtp) {
      alert('Código OTP requerido');
      return;
    }

    const payload = {
      email: this.emailForOtp,
      codigoOtp: this.codigoOtp
    };

    this.otpService.verificarOtp(payload).subscribe({
      next: (res: any) => {
        // Después de verificar OTP, obtener el rol
        const password = this.loginForm.get('password')?.value;
        this.userService.obtenerRol(this.emailForOtp, password).subscribe({
          next: (rol: string) => {
            console.log('Rol obtenido:', rol);
            localStorage.setItem('token', res.token);
            localStorage.setItem('idUsuario', res.id);
            localStorage.setItem('rol', rol);
            localStorage.setItem('nombre', res.nombre);

            // Redirigir según el rol
            switch (rol.trim()) {
              case 'Trader':
              case 'Traderz':
                this.router.navigate(['/dashboard']);
                break;
              case 'Comisionista':
                this.router.navigate(['/comisionista']);
                break;
              case 'Administrador':
                this.router.navigate(['/admin']);
                break;
              case 'AreaLegal':
                this.router.navigate(['/legal']);
                break;
              case 'JuntaDirectiva':
                this.router.navigate(['/junta']);
                break;
              default:
                console.error('Rol no reconocido:', rol);
                alert('Rol no reconocido: ' + rol);
                break;
            }
          },
          error: (err) => {
            console.error('Error al obtener rol:', err);
            alert('Error al obtener el rol del usuario');
          }
        });
      },
      error: (err) => {
        alert('Código inválido o expirado');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}