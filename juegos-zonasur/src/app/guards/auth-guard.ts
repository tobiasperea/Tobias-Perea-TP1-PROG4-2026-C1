import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const usuario = await supabase.getUsuario();

  if (usuario) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};