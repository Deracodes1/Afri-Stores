import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth-route-guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'signup',
    loadComponent: () => import('./Auth/sign-up/sign-up').then((m) => m.Signup),
  },
  {
    path: 'signin',
    loadComponent: () => import('./Auth/signin/signin').then((m) => m.Signin),
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/user-account/user-account').then((m) => m.UserAccount),
    canActivate: [authGuard], // this authguard protects the route
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/user-account/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/user-account/orders/orders').then((m) => m.Orders),
      },
      {
        path: 'payment',
        loadComponent: () => import('./pages/user-account/payment/payment').then((m) => m.Payment),
      },
      {
        path: 'address',
        loadComponent: () => import('./pages/user-account/address/address').then((m) => m.Address),
      },
      {
        path: 'support',
        loadComponent: () => import('./pages/user-account/support/support').then((m) => m.Support),
      },
      {
        path: 'prefrences',
        loadComponent: () =>
          import('./pages/user-account/prefrences/prefrences').then((m) => m.Prefrences),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./pages/user-account/feedback/feedback').then((m) => m.Feedback),
      },
    ],
  },
  // {
  //   path: 'wishlist',
  //   loadComponent: () => import('./wishlist/wishlist').then((m) => m.Wishlist),
  //   canActivate: [authGuard]  // Also protected
  // }
  // 404 Route - this serves as the fallback/error state route!
  {
    path: '**',
    loadComponent: () => import('./pages/error/not-found').then((m) => m.NotFound),
  },
];
