import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule,  CommonModule],
  templateUrl: './registro.html',
})
export class Registro {

  email = '';
  password = '';
  nombre = '';
  apellido = '';
  edad: number | null = null;
  errorMsg = '';
  cargando = false;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async registrar() {
    if (!this.email || !this.password || !this.nombre || !this.apellido || !this.edad) {
      this.errorMsg = 'Completá todos los campos';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    try {
      await this.supabase.registrar(this.email, this.password, {
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad
      });
      this.router.navigate(['/home']);
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        this.errorMsg = 'Este correo ya está registrado';
      } else {
        this.errorMsg = 'Error al registrarse, intentá de nuevo';
      }
    } finally {
      this.cargando = false;
    }
  }
}