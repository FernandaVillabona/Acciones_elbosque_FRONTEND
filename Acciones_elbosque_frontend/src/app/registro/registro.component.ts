import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  registerForm!: FormGroup;
  mockUsers: any[] = [
    { id: 1, email: 'usuario@ejemplo.com' }
  ];


  showPassword: boolean = false;
  
showConfirmPassword = false;

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}

toggleConfirmPasswordVisibility(): void {
  this.showConfirmPassword = !this.showConfirmPassword;
}

  constructor(private fb: FormBuilder, private location: Location, private router: Router ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get passwordErrors() {
    const password = this.registerForm.get('password')?.value || '';
    return {
      length: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[\W_]/.test(password),
      hasLetters: /[a-zA-Z]/.test(password) && /\d/.test(password),
    };
  }

  get showPasswordErrors(): boolean {
    const control = this.registerForm.get('password');
    return !!control?.touched && !!control?.invalid;
  }

  get passwordsMatch(): boolean {
    const pwd = this.registerForm.get('password')?.value;
    const confirm = this.registerForm.get('confirmPassword')?.value;
    return pwd === confirm;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || !this.passwordsMatch || !this.allPasswordRulesPass()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValues = this.registerForm.value;
    const emailExists = this.mockUsers.some(
      (user) => user.email.toLowerCase() === formValues.email.toLowerCase()
    );

    if (emailExists) {
      alert('El correo electrónico ya está registrado.');
      return;
    }

    const newUser = {
      id: Date.now(),
      ...formValues
    };

    this.mockUsers.push(newUser);
    console.log('Usuario registrado:', newUser);

    alert('Usuario registrado exitosamente (simulado)');
    this.registerForm.reset();
  }

  allPasswordRulesPass(): boolean {
    const errors = this.passwordErrors;
    return errors.length && errors.hasUpperCase && errors.hasNumber && errors.hasSymbol && errors.hasLetters;
  }
  goBack(): void {
    this.router.navigate(['/']);
  }
}