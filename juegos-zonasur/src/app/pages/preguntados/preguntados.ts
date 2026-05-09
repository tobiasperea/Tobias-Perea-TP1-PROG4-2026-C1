import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit {

  preguntas: any[] = [];
  preguntaActual: any = null;
  indicePregunta = 0;
  opciones: string[] = [];
  acertadas = 0;
  respondio = false;
  opcionElegida = '';
  partidaTerminada = false;
  cargando = true;

  constructor(
    private http: HttpClient,
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarPreguntas();
  }

  cargarPreguntas() {
    this.cargando = true;
    this.http.get<any>('https://opentdb.com/api.php?amount=10&type=multiple')
      .subscribe({
        next: (res) => {
          this.preguntas = res.results;
          this.mostrarPregunta();
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log('error:', err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }

  mostrarPregunta() {
    if (this.indicePregunta >= this.preguntas.length) {
      this.terminarPartida();
      return;
    }

    this.preguntaActual = this.preguntas[this.indicePregunta];
    this.respondio = false;
    this.opcionElegida = '';

    this.opciones = [
      ...this.preguntaActual.incorrect_answers,
      this.preguntaActual.correct_answer
    ].sort(() => Math.random() - 0.5);

    this.cdr.detectChanges();
  }

  elegir(opcion: string) {
    if (this.respondio) return;
    this.respondio = true;
    this.opcionElegida = opcion;

    if (opcion === this.preguntaActual.correct_answer) {
      this.acertadas++;
    }

    this.cdr.detectChanges();

    setTimeout(() => {
      this.indicePregunta++;
      this.mostrarPregunta();
    }, 1500);
  }

  async terminarPartida() {
    this.partidaTerminada = true;
    this.cdr.detectChanges();
    const usuario = await this.supabase.getUsuario();
    await this.supabase.guardarPartida('partidas_preguntados', {
      usuario_email: usuario?.email,
      preguntas_acertadas: this.acertadas,
      total_preguntas: this.preguntas.length
    });
  }

  reiniciar() {
    this.indicePregunta = 0;
    this.acertadas = 0;
    this.partidaTerminada = false;
    this.respondio = false;
    this.opcionElegida = '';
    this.cargarPreguntas();
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }

  decodear(texto: string) {
    const parser = new DOMParser();
    return parser.parseFromString(texto, 'text/html').body.textContent || '';
  }
}