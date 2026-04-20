import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {

  usuario = '';
  password = '';

  constructor(private router: Router) {}

  ingresar() {

    if (!this.usuario || !this.password) {
      alert('Completá todos los campos');
      return;
    }

    const data = localStorage.getItem('usuario');

    if (!data) {
      alert('No hay usuario registrado');
      return;
    }

    const user = JSON.parse(data);

    if (this.usuario === user.usuario && this.password === user.password) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/error']);
    }
  }
}