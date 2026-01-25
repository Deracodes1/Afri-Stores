import { Component, OnInit, signal } from '@angular/core';
import { User, Order } from '../../../models/user.model';
import { AuthService } from '../../../services/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ShortenamePipe } from '../../../pipes/shortename-pipe';
@Component({
  selector: 'app-profile',
  imports: [ShortenamePipe, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);

  // User data
  user = signal<User | null>(null);
  orders = signal<Order[]>([]);
  // UI states
  isEditingProfile = signal(false);
  isSavingProfile = signal(false);
  saveMessage = signal('');

  // Password change
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  isChangingPassword = signal(false);
  ngOnInit(): void {
    this.loadUserData();
  }
  /**
   * Profile form
   */
  profileForm: FormGroup = this.fb.group({
    firstName: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
    lastName: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    phone: [{ value: '', disabled: true }, [Validators.pattern(/^\+?[\d\s-()]+$/)]],
  });

  /**
   * Password change form
   */
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  //  Load user data from auth service

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
          this.toastService.success(this.saveMessage());
          this.isEditingProfile.set(true);
          this.toggleEditMode();
          this.loadUserData();

          setTimeout(() => this.saveMessage.set(''), 3000);
        }
      }, 1000);
    } else {
      this.profileForm.markAllAsTouched();
      this.toastService.warning('Please fill in all required fields');
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
