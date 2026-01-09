import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  // company name to be used by sign-in and sign-up components
  companyName = 'Afri Mega Stores';
  // Current user signal
  private currentUser = signal<User | null>(null);

  // Auth state
  isLoggedIn = signal<boolean>(false);

  constructor() {
    // Check if user is already logged in (token exists)
    this.checkAuthStatus();
  }

  /**
   * Check if user has a valid token in localStorage
   */
  private checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('currentUser');

    if (token && userJson) {
      this.currentUser.set(JSON.parse(userJson));
      this.isLoggedIn.set(true);
    }
  }

  /**
   * Sign up a new user
   * In real app, this would call your backend API
   */
  signUp(name: string, email: string, password: string) {
    // Mock: Simulate API call
    console.log('Signing up:', { name, email, password });

    // Simulate successful signup
    const newUser: User = {
      id: Date.now(),
      name: name,
      email: email,
    };

    // Save token and user info
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Update state
    this.currentUser.set(newUser);
    this.isLoggedIn.set(true);

    // Redirect to home
    this.router.navigate(['/home']);

    return { success: true, message: 'Account created successfully!' };
  }

  /**
   * Sign in existing user
   * In real app, this would call your backend API
   */
  signIn(email: string, password: string) {
    // Mock: Simulate API call
    console.log('Signing in:', { email, password });

    // Mock validation - in real app, backend validates credentials
    if (password.length < 6) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Simulate successful login
    const user: User = {
      id: Date.now(),
      name: email.split('@')[0], // Use email username as name
      email: email,
    };

    // Save token and user info
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Update state
    this.currentUser.set(user);
    this.isLoggedIn.set(true);

    // Redirect to home
    this.router.navigate(['/home']);

    return { success: true, message: 'Logged in successfully!' };
  }

  /**
   * Log out current user
   */
  logout() {
    // Clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    // Clear state
    this.currentUser.set(null);
    this.isLoggedIn.set(false);

    // Redirect to login
    this.router.navigate(['/login']);
  }

  /**
   * Get current logged in user
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  /**
   * Mock social login - to be implemented later
   */
  socialLogin(provider: 'google' | 'facebook') {
    alert(`${provider} login coming soon! This requires Firebase or OAuth setup.`);
    // TODO: Implement actual social login with Firebase or OAuth
  }
}
