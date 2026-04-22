import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of, Observable } from 'rxjs';
import { User, Order, Address } from '../models/user.model';
import { ToastService } from './toast';
import { environment } from '../../Environments/environment'; // Create this if you haven't

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private apiUrl = `${environment.apiUrl}/auth`; // e.g., http://localhost:3000/api/v1/auth

  // Signals for Reactive State
  currentUser = signal<User | null>(null);
  isLoggedIn = signal<boolean>(false);
  companyName = 'Afri Mega Stores';

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('currentUser');

    if (token && userJson) {
      this.currentUser.set(JSON.parse(userJson));
      this.isLoggedIn.set(true);
    }
  }

  /**
   * Helper to split full name for NestJS
   */
  private splitName(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || parts[0] || '',
    };
  }

  /**
   * REAL Sign Up: Hits NestJS /auth/signup
   */
  signUp(fullName: string, email: string, password: string): Observable<any> {
    const { firstName, lastName } = this.splitName(fullName);

    return this.http
      .post(`${this.apiUrl}/register`, {
        firstName,
        lastName,
        email,
        password,
      })
      .pipe(
        tap((res: any) => {
          this.handleAuthSuccess(res);
          this.toastService.success('Welcome to the Market!');
        }),
      );
  }

  /**
   * REAL Sign In: Hits NestJS /auth/signin
   */
  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        this.handleAuthSuccess(res);
        this.toastService.success(`Welcome back!`);
      }),
    );
  }

  private handleAuthSuccess(res: any) {
    const authData = res.data;

    const userWithFullName = {
      ...authData.user,
      // Add fallback for lastName since it's missing in current JSON output
      name: `${authData.user.firstName} ${authData.user.lastName || ''}`.trim(),
    };

    localStorage.setItem('authToken', authData.access_token);
    localStorage.setItem('currentUser', JSON.stringify(userWithFullName));

    this.currentUser.set(userWithFullName);
    this.isLoggedIn.set(true);
  }
  socialLogin(provider: 'google' | 'facebook') {
    this.toastService.info(`Connecting to ${provider}...`);

    // Mocking a successful delay
    setTimeout(() => {
      this.toastService.warning(
        `Passport ${provider} Strategy not yet configured on NestJS. Please use Email Sign up for now.`,
      );
    }, 1500);
  }
  // 1. Fix for getCurrentUser()
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // 2. Fix for getUserInitials()
  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    const f = user.firstName?.[0] || '';
    const l = user.lastName?.[0] || '';
    return (f + l).toUpperCase() || '??';
  }

  // 3. Fix for updateProfile() (Mocked for now)
  updateProfile(updates: Partial<User>) {
    console.log('Update profile called with:', updates);
    return { success: true, message: 'Profile updated!' };
  }

  // 4. Fix for changePassword() (Mocked for now)
  changePassword(current: string, next: string) {
    console.log('Password change requested');
    return { success: true, message: 'Password changed!' };
  }
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.toastService.info('Logged out successfully');
    this.router.navigate(['/signin']);
  }

  // --- Profile & Address (Future API Calls) ---

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`);
  }

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.apiUrl}/addresses`);
  }
}
