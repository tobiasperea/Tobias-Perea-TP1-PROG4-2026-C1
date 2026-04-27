import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  usuarioLogueado: any = null;

  constructor(
    private supabase: SupabaseService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.usuarioLogueado = await this.supabase.getUsuario();
    this.cdr.detectChanges();

    this.supabase.onAuthChange((session) => {
      this.usuarioLogueado = session?.user ?? null;
      this.cdr.detectChanges();
    });
  }

  async logout() {
    await this.supabase.logout();
    this.usuarioLogueado = null;
    this.router.navigate(['/login']);
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}