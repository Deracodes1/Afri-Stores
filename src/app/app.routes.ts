import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'signup',
    loadComponent: () => import('./sign-up/sign-up').then((m) => m.Signup),
  },
  {
    path: 'signin',
    loadComponent: () => import('./signin/signin').then((m) => m.Signin),
  },
];
