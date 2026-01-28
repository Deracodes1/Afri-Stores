import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css'],
})
export class Signup {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  // company name gotten from auth service
  companyName = this.authService.companyName;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  /**
   * CUSTOM VALIDATOR: Check if passwords match
   * This is called a "validator function"
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    // Return error if passwords don't match
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * REACTIVE FORM with multiple validators
   */
  signupForm: FormGroup = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // At least 8 characters
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/), // Must have lowercase, uppercase, number
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [
        false,
        [
          Validators.requiredTrue, // Must be checked (true)
        ],
      ],
    },
    {
      validators: this.passwordMatchValidator, // Apply custom validator to entire form
    },
  );

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    this.signupForm.markAllAsTouched();

    if (this.signupForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { fullName, email, password } = this.signupForm.value;

      setTimeout(() => {
        const result = this.authService.signUp(fullName, email, password);

        this.isLoading.set(false);

        if (!result.success) {
          this.errorMessage.set(result.message);
        }
      }, 1000);
    }
  }

  signUpWithGoogle() {
    this.authService.socialLogin('google');
  }

  signUpWithFacebook() {
    this.authService.socialLogin('facebook');
  }

  goToSignin() {
    this.router.navigate(['/signin']);
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  /**
   * Check if form has the custom password mismatch error
   */
  get passwordMismatch(): boolean {
    return !!(
      this.signupForm.hasError('passwordMismatch') &&
      this.signupForm.get('confirmPassword')?.touched
    );
  }

  get fullName() {
    return this.signupForm.get('fullName');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  get agreeToTerms() {
    return this.signupForm.get('agreeToTerms');
  }
}
