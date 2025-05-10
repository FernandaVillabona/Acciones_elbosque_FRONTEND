import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../services/users/users.service';
import { OtpResponse, OtpService } from '../services/otp.service'; // ajusta la ruta si es necesario
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

  // Estado para OTP
  requiresOtp = false;
  emailForOtp = '';
  codigoOtp = '';

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

    this.userService.login(email, password).subscribe({
      next: (res: string) => {
        // ⚠️ Si el backend responde con texto plano:
        if (res.includes('Código enviado')) {
          this.requiresOtp = true;
          this.emailForOtp = email;
          alert('Código OTP enviado a tu correo');
        } else {
          try {
            const json = JSON.parse(res);
            if (json.token) {
              localStorage.setItem('token', json.token);
              this.router.navigate(['/dashboard']);
            } else {
              alert('Respuesta inesperada del servidor');
            }
          } catch (e) {
            console.warn('Respuesta no parseable:', res);
            alert('Respuesta inesperada del servidor');
          }
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Credenciales inválidas');
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
  next: (jwt: string) => {
    localStorage.setItem('token', jwt);

    // Obtener payload del JWT (medio)
    const payload = JSON.parse(atob(jwt.split('.')[1]));
localStorage.setItem('idUsuario', payload.sub);

    this.router.navigate(['/dashboard']);
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