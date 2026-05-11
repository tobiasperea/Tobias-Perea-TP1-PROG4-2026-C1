import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';
  errorMsg = '';
  cargando = false;

  // Usuarios de prueba para los 3 botones rápidos
  usuariosPrueba = [
    { email: 'prueba1@gmail.com', password: 'prueba123' },
    { email: 'prueba2@gmail.com', password: 'prueba123' },
    { email: 'prueba3@gmail.com', password: 'prueba123' },
  ];

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  async ingresar() {

    this.errorMsg = '';

    if (!this.email || !this.password) {
      this.errorMsg = 'Completá todos los campos';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      this.errorMsg = 'El correo no tiene un formato válido';
      return;
    }

    if (this.password.length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.cargando = true;

    try {

      await this.supabase.login(this.email, this.password);

      this.router.navigate(['/home']);

    } catch (error: any) {

      this.errorMsg = 'Este usuario no existe o la contraseña es incorrecta';

      this.cargando = false;

      this.cdr.detectChanges();

    }

    this.cargando = false;
  }

  loginRapido(usuario: any) {
    this.email = usuario.email;
    this.password = usuario.password;
  }
}