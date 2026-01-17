import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // Array of active toasts
  private toasts = signal<Toast[]>([]);

  // Expose as readonly
  public toasts$ = this.toasts.asReadonly();

  /**
   * Show a toast notification
   */
  private show(message: string, type: ToastType, duration: number = 5000) {
    const toast: Toast = {
      id: Date.now() + Math.random(), // Unique ID
      message,
      type,
      duration,
    };

    // Add to array
    this.toasts.set([...this.toasts(), toast]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  /**
   * Remove a toast by ID
   */
  remove(id: number) {
    this.toasts.set(this.toasts().filter((t) => t.id !== id));
  }

  /**
   * Show success toast (green)
   */
  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  /**
   * Show error toast (red)
   */
  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  /**
   * Show warning toast (yellow)
   */
  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  /**
   * Show info toast (blue)
   */
  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  /**
   * Clear all toasts
   */
  clear() {
    this.toasts.set([]);
  }
}
