import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common'; // ✅ Importar Location

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
  const { email, password } = this.loginForm.value;

  // Validación quemada
  if (this.loginForm.valid) {
    if (email === 'admin@bosque.com' && password === 'Admin123!') {
      // ✅ Guarda un token simulado
      localStorage.setItem('token', 'fake-jwt-token');
      this.router.navigate(['/dashboard']);
    
    } else {
      alert('Credenciales inválidas');
    }
  } else {
    this.loginForm.markAllAsTouched();
  }
}

goBack(): void {
  this.location.back(); // Navigate to the previous page
}
}