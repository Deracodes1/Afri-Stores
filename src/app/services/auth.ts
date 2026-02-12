import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, Order, Address } from '../models/user.model';
import { ToastService } from './toast';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  toastService = inject(ToastService); // importing the toast service for sending notifactions
  companyName = 'Afri Mega Stores';
  private currentUser = signal<User | null>(null);
  authenticatedState = new BehaviorSubject<boolean>(false);
  isauthenticatedState$ = this.authenticatedState.asObservable();
  private addresses = signal<Address[]>([
    {
      id: 1,
      label: 'HOME',
      street: '12, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
      phone: '+234 800 123 4567',
      isDefault: true,
    },
  ]);

  private orders = signal<Order[]>([
    {
      id: '1',
      productName: 'Sony WH-1000XM4',
      productImage:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      price: 160000,
      status: 'delivered',
      orderDate: 'Oct 24, 2023',
      orderNumber: '449291',
    },
    {
      id: '2',
      productName: 'Apple Watch Series 8',
      productImage:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      price: 280000,
      status: 'in-transit',
      orderDate: 'Sep 12, 2023',
      orderNumber: '448990',
    },
  ]);

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('currentUser');

    if (token && userJson) {
      this.currentUser.set(JSON.parse(userJson));
      this.authenticatedState.next(true);
    }
  }

  /**
   * Parse full name into structured first/last name
   * Handles: lowercase, UPPERCASE, extra spaces, single names
   */
  private parseName(fullName: string): { fullName: string; firstName: string; lastName: string } {
    // Remove extra spaces and trim
    const cleaned = fullName.trim().replace(/\s+/g, ' ');

    // Split into words
    const words = cleaned.split(' ');

    // Capitalize each word properly
    const capitalized = words.map((word) => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    const properFullName = capitalized.join(' ');

    // Parse first and last name
    if (capitalized.length === 0) {
      return { fullName: '', firstName: '', lastName: '' };
    } else if (capitalized.length === 1) {
      // Single name - use for both first and last
      return {
        fullName: properFullName,
        firstName: capitalized[0],
        lastName: capitalized[0],
      };
    } else {
      // Multiple names - first word is firstName, rest is lastName
      return {
        fullName: properFullName,
        firstName: capitalized[0],
        lastName: capitalized.slice(1).join(' '),
      };
    }
  }

  /**
   * Sign up a new user with smart name parsing
   */
  signUp(fullName: string, email: string, password: string) {
    // Parse the name intelligently
    const parsedName = this.parseName(fullName);

    // Validate that we have at least something
    if (!parsedName.firstName) {
      this.toastService.error('Please enter your name');
      return { success: false, message: 'Please enter your name' };
    }

    const newUser: User = {
      id: Date.now(),
      name: parsedName.fullName, // "John Smith"
      firstName: parsedName.firstName, // "John"
      lastName: parsedName.lastName, // "Smith"
      email: email,
      memberSince: new Date().getFullYear().toString(),
      membershipType: 'standard',
      totalOrders: 0,
      totalReviews: 0,
    };

    // Save to localStorage
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Update state
    this.currentUser.set(newUser);
    this.authenticatedState.next(true);

    // Redirect to home
    this.router.navigate(['/home']);

    console.log('User created:', newUser);
    return { success: true, message: 'Account created successfully!' };
  }

  /**
   * Sign in existing user
   */
  signIn(email: string, password: string) {
    if (password.length < 6) {
      this.toastService.error('Invalid email or password');
      return { success: false, message: 'Invalid credentials' };
    }

    // Mock user - in production, this comes from backend
    const user: User = {
      id: Date.now(),
      name: 'John Okoro',
      firstName: 'John',
      lastName: 'Okoro',
      email: email,
      phone: '+234 800 123 4567',
      memberSince: '2021',
      membershipType: 'gold',
      totalOrders: 24,
      totalReviews: 12,
    };

    const userEmailasMockToken = user.email;
    localStorage.setItem('authToken', userEmailasMockToken);
    localStorage.setItem('currentUser', JSON.stringify(user));

    this.currentUser.set(user);
    this.authenticatedState.next(true);
    this.toastService.success(`Welcome back, ${user.firstName}!`);
    this.router.navigate(['/home']);

    return { success: true, message: 'Logged in successfully!' };
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    this.currentUser.set(null);
    this.authenticatedState.next(false);
    this.toastService.info('You have been logged out');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }
  get isLoggedIn(): boolean {
    return this.authenticatedState.value;
  }
  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>) {
    const current = this.currentUser();
    if (current) {
      // If firstName or lastName changed, update fullName too
      let fullName = current.name;
      if (updates.firstName || updates.lastName) {
        const firstName = updates.firstName || current.firstName || '';
        const lastName = updates.lastName || current.lastName || '';
        fullName = `${firstName} ${lastName}`.trim();
      }

      const updated = {
        ...current,
        ...updates,
        name: fullName, // Always keep fullName in sync
      };

      this.currentUser.set(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));

      return { success: true, message: 'Profile updated successfully!' };
    }
    return { success: false, message: 'No user logged in' };
  }

  /**
   * Get user initials for avatar
   */
  /**
   * Get user initials for avatar
   */
  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return '';

    // Try to use firstName and lastName first
    if (user.firstName && user.lastName) {
      // If they're the same (single name), use first 2 letters
      if (user.firstName === user.lastName) {
        return user.firstName.substring(0, 2).toUpperCase();
      }
      // Different names - use first letter of each
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }

    // Fallback to parsing full name
    if (user.name) {
      const names = user.name.trim().split(' ');
      if (names.length === 1) {
        return names[0].substring(0, 2).toUpperCase();
      }
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }

    return '';
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string) {
    if (currentPassword.length < 6 || newPassword.length < 8) {
      return { success: false, message: 'Invalid password' };
    }

    console.log('Changing password');
    return { success: true, message: 'Password changed successfully!' };
  }

  /**
   * Get user addresses
   */
  getAddresses() {
    return this.addresses();
  }

  /**
   * Get user orders
   */
  getOrders() {
    return this.orders();
  }

  /**
   * Add new address
   */
  addAddress(address: Omit<Address, 'id'>) {
    const newAddress = {
      ...address,
      id: Date.now(),
    };
    this.addresses.set([...this.addresses(), newAddress]);
    return { success: true, message: 'Address added successfully!' };
  }

  /**
   * Mock social login
   */
  socialLogin(provider: 'google' | 'facebook') {
    this.toastService.info(`${provider} login coming soon! We're working on it.`);
  }
}
