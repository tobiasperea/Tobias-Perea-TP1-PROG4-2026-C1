import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {

  mostrar = false;
  mensajes: any[] = [];
  nuevoMensaje = '';
  usuario = '';

  @ViewChild('contenedorMensajes') contenedor!: ElementRef;

  constructor(
    private chatService: ChatService,
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUsuario();
    this.usuario = user?.email || 'anonimo';

    this.mensajes = await this.chatService.traerMensajes();
    this.scrollAbajo();

    
    this.supabaseService.onAuthChange(async (session) => {
      if (session) {
        this.usuario = session.user.email || 'anonimo';
      } else {
        this.usuario = '';
        this.mostrar = false;
        this.cdr.detectChanges();
      }
    });

    this.chatService.escucharMensajes((mensajeNuevo: any) => {
      const existe = this.mensajes.find(m => m.id === mensajeNuevo.id);
      if (!existe) {
        this.mensajes.push(mensajeNuevo);
        this.cdr.detectChanges();
        this.scrollAbajo();
      }
    });
  }

  scrollAbajo() {
    setTimeout(() => {
      if (this.contenedor?.nativeElement) {
        this.contenedor.nativeElement.scrollTop =
          this.contenedor.nativeElement.scrollHeight;
      }
    }, 50);
  }

  toggle() {
    this.mostrar = !this.mostrar;
    if (this.mostrar) this.scrollAbajo();
  }

  async enviar() {
    if (!this.nuevoMensaje.trim()) return;
    const texto = this.nuevoMensaje;
    this.nuevoMensaje = '';
    await this.chatService.enviarMensaje(this.usuario, texto);
  }
}