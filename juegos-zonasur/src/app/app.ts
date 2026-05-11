import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chat } from './components/chat/chat';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  usuarioLogueado: any = null;
  nombreUsuario = '';

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) { }




  async ngOnInit() {
    this.usuarioLogueado = await this.supabase.getUsuario();
    if (this.usuarioLogueado) {
      this.nombreUsuario = await this.supabase.getNombreUsuario();
    }
    this.cdr.detectChanges();

    this.supabase.onAuthChange(async (session) => {
      this.usuarioLogueado = session?.user ?? null;
      if (this.usuarioLogueado) {
        this.nombreUsuario = await this.supabase.getNombreUsuario();
      } else {
        this.nombreUsuario = '';
      }
      this.cdr.detectChanges();
    });
  }
}