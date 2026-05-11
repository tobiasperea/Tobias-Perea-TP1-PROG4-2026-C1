import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';


@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenor implements OnInit {

  palos = ['♠', '♥', '♦', '♣'];
  mazo: any[] = [];
  cartaActual: any = null;
  cartaSiguiente: any = null;
  cartasAcertadas = 0;
  partidaTerminada = false;
  gano = false;
  resultado = '';
  maxAciertos = 10;

  constructor(private supabase: SupabaseService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.generarMazo();
    this.siguienteCarta();
  }

  generarMazo() {
    this.mazo = [];
    for (let palo of this.palos) {
      for (let num = 1; num <= 12; num++) {
        this.mazo.push({ numero: num, palo });
      }
    }
    this.mazo = this.mazo.sort(() => Math.random() - 0.5);
  }

  siguienteCarta() {
    if (this.mazo.length < 2) {
      this.terminarPartida(true);
      return;
    }
    this.cartaActual = this.mazo.pop();
    this.cartaSiguiente = null;
    this.resultado = '';
  }

  async elegir(eleccion: 'mayor' | 'menor') {
    if (this.partidaTerminada || this.cartaSiguiente) return;

    const siguiente = this.mazo[this.mazo.length - 1];
    const esMayor = siguiente.numero > this.cartaActual.numero;
    const esMenor = siguiente.numero < this.cartaActual.numero;
    const esIgual = siguiente.numero === this.cartaActual.numero;

    let acerto = false;
    if (eleccion === 'mayor' && esMayor) acerto = true;
    if (eleccion === 'menor' && esMenor) acerto = true;
    if (esIgual) acerto = true;


    this.cartaSiguiente = siguiente;

    if (acerto) {
      this.cartasAcertadas++;
      this.resultado = '✅ ¡Correcto!';

      if (this.cartasAcertadas >= this.maxAciertos) {
        setTimeout(() => this.terminarPartida(true), 800);
        return;
      }


      setTimeout(() => {
        this.cartaActual = this.mazo.pop()!;
        this.cartaSiguiente = null;
        this.resultado = '';
      }, 800);

    } else {
      this.resultado = '❌ Incorrecto';
      setTimeout(() => {
        this.cartaSiguiente = null;
        this.terminarPartida(false);
      }, 800);
    }
  }

  async terminarPartida(gano: boolean) {
    this.gano = gano;
    this.partidaTerminada = true;
    this.cartaSiguiente = null;
    this.cdr.detectChanges();

    const usuario = await this.supabase.getUsuario();
    await this.supabase.guardarPartida('partidas_mayor_menor', {
      usuario_email: usuario?.email,
      cartas_acertadas: this.cartasAcertadas
    });
  }

  reiniciar() {
    this.cartasAcertadas = 0;
    this.partidaTerminada = false;
    this.gano = false;
    this.resultado = '';
    this.generarMazo();
    this.siguienteCarta();
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}