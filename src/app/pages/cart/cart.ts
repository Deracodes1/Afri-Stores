import { Component, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { ProductsService } from '../../services/products';
import { Product } from '../../models/products.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast';
import { StateService } from '../../services/state.service.ts';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  imports: [FormsModule],
  styleUrls: ['./cart.css'],
})
export class Cart {
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private StateService = inject(StateService);

  cartItems = this.StateService.cart$;
  cartTotal = this.StateService.cartItemCount$;
  promoCodeInput = signal<string>('');
  promoMessage = signal<string>('');
  promoSuccess = signal<boolean>(false);
  activeQuantityId = signal<number | null>(null);

  // Computed values from service
  subtotal = this.StateService.cartSubtotal$;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.StateService.cart$;
  }
}
