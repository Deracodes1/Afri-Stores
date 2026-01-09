import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.html',
  styleUrls: ['./signin.css'],
})
export class Signin {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  // company name
  companyName = this.authService.companyName;
  // Show/hide password state
  showPassword = signal(false);

  // Loading state for submit button
  isLoading = signal(false);

  // Error message
  errorMessage = signal('');

  /**
   * REACTIVE FORM SETUP
   * FormGroup contains all form controls
   * Each control has initial value and validators
   */
  signinForm: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required, // Field is required
        Validators.email, // Must be valid email format
      ],
    ],
    password: [
      '',
      [
        Validators.required, // Field is required
        Validators.minLength(6), // Minimum 6 characters
      ],
    ],
  });

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  /**
   * Handle form submission
   */
  onSubmit() {
    // Mark all fields as touched to show validation errors
    this.signinForm.markAllAsTouched();

    // Only proceed if form is valid
    if (this.signinForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { email, password } = this.signinForm.value;

      // Simulate API delay
      setTimeout(() => {
        const result = this.authService.signIn(email, password);

        this.isLoading.set(false);

        if (!result.success) {
          this.errorMessage.set(result.message);
        }
        // If successful, AuthService handles redirect
      }, 1000);
    }
  }

  /**
   * Handle social login buttons
   */
  signInWithGoogle() {
    this.authService.socialLogin('google');
  }

  signInWithFacebook() {
    this.authService.socialLogin('facebook');
  }

  /**
   * Navigate to signup page
   */
  goToSignup() {
    this.router.navigate(['/signup']);
  }

  /**
   * Helper method to check if a field has error
   * and has been touched by user
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.signinForm.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  /**
   * Get specific form control for template access
   */
  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }
}
