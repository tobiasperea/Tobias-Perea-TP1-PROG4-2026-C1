import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
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

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ingresar() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Completá todos los campos';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    try {
      await this.supabase.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMsg = 'Correo o contraseña incorrectos';
    } finally {
      this.cargando = false;
    }
  }

  loginRapido(usuario: any) {
    this.email = usuario.email;
    this.password = usuario.password;
  }
}