import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // REGISTRO
  async registrar(email: string, password: string, datos: any) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Guardar datos extra en la tabla usuarios
    const { error: dbError } = await this.supabase
      .from('usuarios')
      .insert({
        id: data.user?.id,
        email,
        nombre: datos.nombre,
        apellido: datos.apellido,
        edad: datos.edad
      });

    if (dbError) throw dbError;
    return data;
  }

  // LOGIN
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  // LOGOUT
  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // OBTENER USUARIO ACTUAL
  async getUsuario() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  // ESCUCHAR CAMBIOS DE SESION
  onAuthChange(callback: (session: any) => void) {
    this.supabase.auth.onAuthStateChange((event, session) => {
      callback(session);
    });
  }
}