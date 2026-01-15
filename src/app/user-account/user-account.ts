import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';
import { User, Address, Order } from '../models/user.model';
import { ShortenamePipe } from '../pipes/shortename-pipe';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ShortenamePipe],
  templateUrl: './user-account.html',
  styleUrls: ['./user-account.css'],
})
export class UserAccount implements OnInit {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  // brand/comapany name
  companyName = this.authService.companyName;
  // Current active section
  activeSection = signal<string>('profile');

  // User data
  user = signal<User | null>(null);
  orders = signal<Order[]>([]);
  addresses = signal<Address[]>([]);

  // UI states
  isEditingProfile = signal(false);
  isSavingProfile = signal(false);
  saveMessage = signal('');

  // Password change
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  isChangingPassword = signal(false);

  /**
   * Profile form
   */
  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^\+?[\d\s-()]+$/)]],
  });

  /**
   * Password change form
   */
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit() {
    // Add a small delay to ensure user data is ready

    this.loadUserData();
  }

  /**
   * Load user data from auth service
   */

  loadUserData() {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      this.user.set(currentUser);
      // Ensure firstName and lastName exist
      const firstName = currentUser.firstName || currentUser.name?.split(' ')[0] || '';
      const lastName =
        currentUser.lastName || currentUser.name?.split(' ').slice(1).join(' ') || firstName;

      // Populate profile form
      this.profileForm.patchValue({
        firstName: firstName,
        lastName: lastName,
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      });
    }

    this.orders.set(this.authService.getOrders());
    this.addresses.set(this.authService.getAddresses());
  }

  /**
   * Navigate between sections
   */
  setActiveSection(section: string) {
    this.activeSection.set(section);
  }

  /*
   Toggle profile edit mode
   */

  toggleEditMode() {
    this.isEditingProfile.set(!this.isEditingProfile());

    if (this.isEditingProfile()) {
      // Enable all fields when editing
      this.profileForm.get('firstName')?.enable();
      this.profileForm.get('lastName')?.enable();
      this.profileForm.get('email')?.enable();
      this.profileForm.get('phone')?.enable();
    } else {
      // Disable all fields when not editing (also resets form)
      this.profileForm.get('firstName')?.disable();
      this.profileForm.get('lastName')?.disable();
      this.profileForm.get('email')?.disable();
      this.profileForm.get('phone')?.disable();

      // Reset to original values
      this.loadUserData();
    }
  }

  /**
   * Save profile changes
   */
  saveProfile() {
    if (this.profileForm.valid) {
      this.isSavingProfile.set(true);

      const { firstName, lastName, email, phone } = this.profileForm.value;

      setTimeout(() => {
        const result = this.authService.updateProfile({
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          phone,
        });

        this.isSavingProfile.set(false);

        if (result.success) {
          this.saveMessage.set('Profile updated successfully!');
          this.isEditingProfile.set(false);
          this.loadUserData();

          setTimeout(() => this.saveMessage.set(''), 3000);
        }
      }, 1000);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  /**
   * Change password
   */
  changePassword() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

      if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      this.isChangingPassword.set(true);

      setTimeout(() => {
        const result = this.authService.changePassword(currentPassword, newPassword);

        this.isChangingPassword.set(false);

        if (result.success) {
          alert('Password changed successfully!');
          this.passwordForm.reset();
        } else {
          alert(result.message);
        }
      }, 1000);
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  /**
   * Logout
   */
  logout() {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout();
      this.router.navigate(['/home']);
    }
  }

  /**
   * Get status badge color
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'in-transit':
        return 'bg-blue-100 text-blue-700';
      case 'track-order':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  /**
   * Format status text
   */
  getStatusText(status: string): string {
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(field: 'current' | 'new') {
    if (field === 'current') {
      this.showCurrentPassword.set(!this.showCurrentPassword());
    } else {
      this.showNewPassword.set(!this.showNewPassword());
    }
  }

  /**
   * Helper for form validation
   */
  hasError(formName: 'profile' | 'password', fieldName: string, errorType: string): boolean {
    const form = formName === 'profile' ? this.profileForm : this.passwordForm;
    const field = form.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }
}
