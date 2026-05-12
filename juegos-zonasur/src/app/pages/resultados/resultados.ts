import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class Resultados implements OnInit {

  ahorcado: any[] = [];
  mayorMenor: any[] = [];
  preguntados: any[] = [];
  simonDice: any[] = [];
  cargando = true;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    const [a, m, p, s] = await Promise.all([
      this.supabase.getResultados('partidas_ahorcado', 'tiempo_segundos', true),
      this.supabase.getResultados('partidas_mayor_menor', 'cartas_acertadas', false),
      this.supabase.getResultados('partidas_preguntados', 'preguntas_acertadas', false),
      this.supabase.getResultados('partidas_simon_dice', 'ronda_maxima', false)
    ]);

    this.ahorcado = a.sort((x: any, y: any) => {


      if (x.gano && !y.gano) return -1;
      if (!x.gano && y.gano) return 1;


      return x.tiempo_segundos - y.tiempo_segundos;

    });
    this.mayorMenor = m;
    this.preguntados = p;
    this.simonDice = s;
    this.cargando = false;
    this.cdr.detectChanges();
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}