import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';


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
  nuevoMensaje: string = '';
  usuario: string = 'test@mail.com'; 

  constructor(private chatService: ChatService) {}
  @ViewChild('contenedorMensajes') contenedor!: ElementRef;

  scrollAbajo() {
    setTimeout(() => {
      this.contenedor.nativeElement.scrollTop =
        this.contenedor.nativeElement.scrollHeight;
    }, 0);
  }

  async ngOnInit() {
    this.mensajes = await this.chatService.traerMensajes();

  
    const { data } = await this.chatService.supabase.auth.getUser();
    this.usuario = data.user?.email || 'anonimo';

    this.chatService.escucharMensajes((msg: any) => {
      this.mensajes.push(msg);
    });
  }

  toggle() {
    console.log('click');
    this.mostrar = !this.mostrar;
  }
  async enviar() {
    if (!this.nuevoMensaje.trim()) return;

    const { data } = await this.chatService.supabase.auth.getUser();
    const usuario = data.user?.email || 'anonimo';

    const mensaje = {
      usuario_email: usuario,
      mensaje: this.nuevoMensaje,
      fecha: new Date()
    };

    this.mensajes.push(mensaje);

    await this.chatService.enviarMensaje(
      usuario,
      this.nuevoMensaje
    );

    this.nuevoMensaje = '';
  }
}