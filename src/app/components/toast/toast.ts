import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast';
import { Toast } from '../../models/toast.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css'],
})
export class ToastComponent {
  private toastService = inject(ToastService);

  // Get toasts from service
  toasts = this.toastService.toasts$;

  /**
   * Remove a toast
   */
  removeToast(id: number) {
    this.toastService.remove(id);
  }

  /**
   * Get icon for toast type
   */
  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fa-circle-check';
      case 'error':
        return 'fa-circle-xmark';
      case 'warning':
        return 'fa-triangle-exclamation';
      case 'info':
        return 'fa-circle-info';
      default:
        return 'fa-circle-info';
    }
  }

  /**
   * Get styles for toast type
   */
  getToastClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  }

  /**
   * Get icon color for toast type
   */
  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }
}
