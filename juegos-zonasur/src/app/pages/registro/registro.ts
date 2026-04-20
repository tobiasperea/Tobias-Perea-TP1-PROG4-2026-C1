import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.html',
})
export class Registro {

  usuario = '';
  password = '';

  constructor(private router: Router) {}

  registrar() {

    if (!this.usuario || !this.password) {
      alert('Completá todos los campos');
      return;
    }

    if (this.password.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    const user = {
      usuario: this.usuario,
      password: this.password
    };

    localStorage.setItem('usuario', JSON.stringify(user));

    this.router.navigate(['/login']);
  }
}