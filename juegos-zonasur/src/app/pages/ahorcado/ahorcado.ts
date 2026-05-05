import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class Ahorcado implements OnInit, OnDestroy {

  palabras = ['angular', 'supabase', 'typescript', 'programacion', 'zonasur', 'conurbano', 'sarandí', 'avellaneda'];
  palabra = '';
  letrasAdivinadas: string[] = [];
  letrasErradas: string[] = [];
  maxErrores = 6;
  abecedario = 'abcdefghijklmnopqrstuvwxyz'.split('');
  tiempoSegundos = 0;
  intervalo: any;
  partidaTerminada = false;
  gano = false;

  constructor(private supabase: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.palabra = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.intervalo = setInterval(() => this.tiempoSegundos++, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  get palabraMostrada() {
    return this.palabra.split('').map(l => this.letrasAdivinadas.includes(l) ? l : '_').join(' ');
  }

  get errores() {
    return this.letrasErradas.length;
  }

  async elegirLetra(letra: string) {
    if (this.partidaTerminada) return;
    if (this.letrasAdivinadas.includes(letra) || this.letrasErradas.includes(letra)) return;

    if (this.palabra.includes(letra)) {
      this.letrasAdivinadas.push(letra);
      if (this.palabra.split('').every(l => this.letrasAdivinadas.includes(l))) {
        this.terminarPartida(true);
      }
    } else {
      this.letrasErradas.push(letra);
      if (this.errores >= this.maxErrores) {
        this.terminarPartida(false);
      }
    }
  }

  async terminarPartida(gano: boolean) {
    this.gano = gano;
    this.partidaTerminada = true;
    clearInterval(this.intervalo);

    const usuario = await this.supabase.getUsuario();

    await this.supabase.guardarPartida('partidas_ahorcado', {
      usuario_email: usuario?.email,
      palabra: this.palabra,
      letras_seleccionadas: this.letrasAdivinadas.length + this.letrasErradas.length,
      tiempo_segundos: this.tiempoSegundos,
      gano
    });
  }

  reiniciar() {
    this.letrasAdivinadas = [];
    this.letrasErradas = [];
    this.tiempoSegundos = 0;
    this.partidaTerminada = false;
    this.gano = false;
    this.palabra = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.intervalo = setInterval(() => this.tiempoSegundos++, 1000);
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}