import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Štěpán Omelka · Full Stack Developer',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail').then((m) => m.ProjectDetail),
  },
  {
    path: '**',
    title: 'Page not found · Štěpán Omelka',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
