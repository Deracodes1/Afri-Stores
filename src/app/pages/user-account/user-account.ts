import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User, Address, Order } from '../../models/user.model';
import { ToastService } from '../../services/toast';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-account.html',
  styleUrls: ['./user-account.css'],
})
export class UserAccount implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);

  // brand/company name
  companyName = this.authService.companyName;
  // Current active section
  activeSection = signal<string>('profile');

  // User data
  user = signal<User | null>(null);

  addresses = signal<Address[]>([]);

  // Password change
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  isChangingPassword = signal(false);

  /**
   * Profile form
   */

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
   * Load user address data from auth service
   */

  loadUserData() {
    this.addresses.set(this.authService.getAddresses());
  }

  /**
   * highlight the active section
   */
  setActiveSection(section: string) {
    this.activeSection.set(section);
  }

  /**
   * Change password
   */
  changePassword() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

      if (newPassword !== confirmPassword) {
        this.toastService.error('Passwords do not match!');
        return;
      }

      this.isChangingPassword.set(true);

      setTimeout(() => {
        const result = this.authService.changePassword(currentPassword, newPassword);

        this.isChangingPassword.set(false);

        if (result.success) {
          this.toastService.success('Password changed successfully!');
          this.passwordForm.reset();
        } else {
          this.toastService.error(result.message);
        }
      }, 1000);
    } else {
      this.passwordForm.markAllAsTouched();
      this.toastService.warning('Please fill in all password fields');
    }
  }

  /**
   * Logout
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
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
}
