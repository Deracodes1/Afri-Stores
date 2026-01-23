import { Component, signal, inject, OnInit } from '@angular/core';
import { User, Order } from '../../../models/user.model';
import { AuthService } from '../../../services/auth';
@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders = signal<Order[]>([]);
  authService = inject(AuthService);
  ngOnInit(): void {
    this.loadUserData();
  }
  loadUserData() {
    this.orders.set(this.authService.getOrders());
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
}
