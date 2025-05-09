import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common'; // ✅ Importar Location
import { UserService } from '../services/users/users.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private userService: UserService,
    private router: Router  // ✅ agrega Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  showPassword = false;

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}

  
onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { email, password } = this.loginForm.value;

  // ✅ Acceso quemado de prueba
  if (email === 'test@bosque.com' && password === 'Test123!') {
    localStorage.setItem('token', 'fake-token-for-test-user');
    this.router.navigate(['/dashboard']);
    return;
  }

  // ✅ Acceso real con API
  this.userService.login(email, password).subscribe({
    next: (token) => {
      localStorage.setItem('token', token);
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error('Login error:', err);
      alert('Credenciales inválidas');
    }
  });
}

goBack(): void {
  this.router.navigate(['/']);
}
}