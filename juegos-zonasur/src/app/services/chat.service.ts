import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://wbhjeonlskiibgbxypfi.supabase.co',
      'sb_publishable_KJR3mLiM9JsHoYOMdMNLGg_UiW9eCpn'
    );
  }
  async enviarMensaje(usuario_email: string, mensaje: string) {
    await this.supabase.from('chat').insert([
      {
        usuario_email,
        mensaje,
        fecha: new Date()
      }
    ]);
  }

  async traerMensajes() {
    const { data, error } = await this.supabase
      .from('chat')
      .select('*')
      .order('fecha', { ascending: true });

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  }
  escucharMensajes(callback: any) {
    this.supabase
      .channel('chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat' },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  }
}