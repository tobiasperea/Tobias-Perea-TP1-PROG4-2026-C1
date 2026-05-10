import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-simon-dice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simon-dice.html',
  styleUrl: './simon-dice.css'
})
export class SimonDice implements OnInit {

  colores = ['rojo', 'verde', 'azul', 'amarillo'];
  secuencia: string[] = [];
  inputJugador: string[] = [];
  colorActivo = '';
  ronda = 0;
  maxRondas = 10;
  esperandoJugador = false;
  partidaTerminada = false;
  gano = false;
  mensaje = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    setTimeout(() => this.siguienteRonda(), 1000);
  }

  siguienteRonda() {
    this.ronda++;
    this.inputJugador = [];
    this.esperandoJugador = false;
    this.mensaje = '';

    const colorRandom = this.colores[Math.floor(Math.random() * this.colores.length)];
    this.secuencia.push(colorRandom);

    this.mostrarSecuencia();
  }

  mostrarSecuencia() {
    let i = 0;
    const intervalo = setInterval(() => {
      this.colorActivo = this.secuencia[i];
      this.cdr.detectChanges();

      setTimeout(() => {
        this.colorActivo = '';
        this.cdr.detectChanges();
        i++;

        if (i >= this.secuencia.length) {
          clearInterval(intervalo);
          this.esperandoJugador = true;
          this.cdr.detectChanges();
        }
      }, 600);
    }, 1000);
  }

  elegirColor(color: string) {
    if (!this.esperandoJugador || this.partidaTerminada) return;

    // Flash del color tocado
    this.colorActivo = color;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.colorActivo = '';
      this.cdr.detectChanges();
    }, 300);

    this.inputJugador.push(color);
    const idx = this.inputJugador.length - 1;

    if (this.inputJugador[idx] !== this.secuencia[idx]) {
      setTimeout(() => this.terminarPartida(false), 300);
      return;
    }

    if (this.inputJugador.length === this.secuencia.length) {
      if (this.ronda >= this.maxRondas) {
        setTimeout(() => this.terminarPartida(true), 300);
      } else {
        this.mensaje = '✅ ¡Correcto!';
        this.esperandoJugador = false;
        this.cdr.detectChanges();
        setTimeout(() => this.siguienteRonda(), 1000);
      }
    }
  }

  async terminarPartida(gano: boolean) {
    this.gano = gano;
    this.partidaTerminada = true;
    this.cdr.detectChanges();

    const usuario = await this.supabase.getUsuario();
    await this.supabase.guardarPartida('partidas_simon_dice', {
      usuario_email: usuario?.email,
      ronda_maxima: this.ronda,
      gano
    });
  }

  reiniciar() {
    this.secuencia = [];
    this.inputJugador = [];
    this.colorActivo = '';
    this.ronda = 0;
    this.esperandoJugador = false;
    this.partidaTerminada = false;
    this.gano = false;
    this.mensaje = '';
    setTimeout(() => this.siguienteRonda(), 1000);
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}