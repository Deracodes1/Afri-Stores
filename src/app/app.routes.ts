import { Routes } from '@angular/router';
import { authGuard } from './Route-Guards/auth-guard'; // Import the guard

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
  {
    path: 'account',
    loadComponent: () => import('./user-account/user-account').then((m) => m.UserAccount),
    canActivate: [authGuard], // ← Add this line to protect the route
  },
  //   {
  //   path: 'orders',
  //   loadComponent: () => import('./orders/orders').then((m) => m.Orders),
  //   canActivate: [authGuard]  // Also protected
  // },
  // {
  //   path: 'wishlist',
  //   loadComponent: () => import('./wishlist/wishlist').then((m) => m.Wishlist),
  //   canActivate: [authGuard]  // Also protected
  // }
];
