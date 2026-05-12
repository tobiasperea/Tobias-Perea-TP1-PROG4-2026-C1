import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { Modal } from '../../components/modal/modal';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, Modal],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  email = '';
  password = '';
  nombre = '';
  apellido = '';
  edad: number | null = null;
  errorMsg = '';
  errorNombre = '';
  errorApellido = '';
  errorEdad = '';
  errorEmail = '';
  errorPassword = '';
  errorGeneral = '';
  cargando = false;

  constructor(private supabase: SupabaseService, private router: Router) { }

  async registrar() {

    this.errorMsg = '';

    if (
      !this.email ||
      !this.password ||
      !this.nombre ||
      !this.apellido ||
      !this.edad
    ) {
      this.errorMsg = 'Completá todos los campos';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      this.errorMsg = 'El correo no tiene un formato válido';
      return;
    }

    if (this.edad < 1 || this.edad > 99) {
      this.errorMsg = 'La edad debe ser entre 1 y 99 años';
      return;
    }

    if (this.password.length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.nombre.length < 2) {
      this.errorMsg = 'El nombre debe tener al menos 2 caracteres';
      return;
    }

    this.cargando = true;

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