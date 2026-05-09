import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private supabase: SupabaseService) {}

  async enviarMensaje(usuario_email: string, mensaje: string) {
    await this.supabase['supabase'].from('chat').insert([{
      usuario_email,
      mensaje,
      fecha: new Date()
    }]);
  }

  async traerMensajes() {
    const { data, error } = await this.supabase['supabase']
      .from('chat')
      .select('*')
      .order('fecha', { ascending: true });

    if (error) return [];
    return data;
  }

  escucharMensajes(callback: any) {
    this.supabase['supabase']
      .channel('chat-global-' + Date.now())
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat' },
        (payload) => {
          console.log('mensaje recibido:', payload.new);
          callback(payload.new);
        }
      )
      .subscribe((status: any) => {
        console.log('estado del canal:', status);
      });
  }
}