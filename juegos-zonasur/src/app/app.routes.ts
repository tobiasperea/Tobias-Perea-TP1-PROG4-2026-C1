import { Routes } from '@angular/router';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro')
        .then(m => m.Registro)
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home')
        .then(m => m.Home)
  },

  {
    path: 'quien-soy',
    loadComponent: () =>
      import('./pages/quien-soy/quien-soy')
        .then(m => m.QuienSoy)
  },

  {
    path: 'ahorcado',
    loadComponent: () =>
      import('./pages/ahorcado/ahorcado')
        .then(m => m.Ahorcado)
  },

  {
    path: 'mayor-menor',
    loadComponent: () =>
      import('./pages/mayor-menor/mayor-menor')
        .then(m => m.MayorMenor)
  },

  {
    path: 'preguntados',
    loadComponent: () =>
      import('./pages/preguntados/preguntados')
        .then(m => m.Preguntados)
  },

  {
    path: 'simon-dice',
    loadComponent: () =>
      import('./pages/simon-dice/simon-dice')
        .then(m => m.SimonDice)
  },

  {
    path: 'resultados',
    loadComponent: () =>
      import('./pages/resultados/resultados')
        .then(m => m.Resultados)
  },

  {
    path: '**',
    loadComponent: () =>
      import('./pages/error/error')
        .then(m => m.Error)
  }

];