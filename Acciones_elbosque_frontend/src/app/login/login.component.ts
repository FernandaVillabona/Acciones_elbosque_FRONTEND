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
    next: (rol: string) => {
      console.log('Login exitoso, rol recibido:', rol);

      // Guardar el rol y un token temporal
      localStorage.setItem('rol', rol);
      localStorage.setItem('token', 'temp-token-' + Date.now());

      // 🔁 Obtener datos completos del usuario
      this.userService.getUserByEmail(email).subscribe({
  next: (usuario) => {
    localStorage.setItem('idUsuario', usuario.id);
    localStorage.setItem('nombre', usuario.nombre);
    localStorage.setItem('apellido', usuario.apellido);
    localStorage.setItem('rol', usuario.rol);

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
              this.errorMessage = 'Rol no reconocido: ' + rol;
              break;
          }
        },
        error: err => {
          console.error('❌ No se pudo obtener el usuario por email:', err);
          this.errorMessage = 'Error al obtener datos del usuario.';
        }
      });
    },
    error: (err) => {
      console.error('Error en login:', err);
      this.errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
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
        localStorage.setItem('token', res.token);
        localStorage.setItem('idUsuario', res.id);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('nombre', res.nombre);

        // Redirigir según el rol
        switch (res.rol) {
          case 'Trader':
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
            alert('Rol no reconocido');
            break;
        }
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