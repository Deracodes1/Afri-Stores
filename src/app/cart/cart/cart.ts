import { Component, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { ProductsService } from '../../services/products';
import { Product } from '../../models/products.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast';
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

  cartItems = signal<Product[]>([]);
  cartTotal = this.productsService.NumOfSelectedProducts;
  promoCodeInput = signal<string>('');
  promoMessage = signal<string>('');
  promoSuccess = signal<boolean>(false);
  activeQuantityId = signal<number | null>(null);

  // Computed values from service
  subtotal = this.productsService.cartSubtotal;
  tax = this.productsService.cartTax;
  total = this.productsService.cartTotal;
  promoDiscount = signal<number>(0);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems.set(this.productsService.getSelectedProducts());
    this.promoDiscount.set(this.productsService.getPromoDiscount());
  }

  increaseQuantity(productId: number) {
    const product = this.cartItems().find((p) => p.id === productId);
    if (product) {
      const newQuantity = (product.quantity || 1) + 1;
      this.productsService.updateQuantity(productId, newQuantity);
      this.loadCart();
    }
  }

  decreaseQuantity(productId: number) {
    const product = this.cartItems().find((p) => p.id === productId);
    if (product && (product.quantity || 1) > 1) {
      const newQuantity = (product.quantity || 1) - 1;
      this.productsService.updateQuantity(productId, newQuantity);
      this.loadCart();
    }
  }

  removeItem(productId: number) {
    this.productsService.removeFromCart(productId);
    this.loadCart();
  }

  applyPromoCode() {
    const code = this.promoCodeInput();
    const result = this.productsService.applyPromoCode(code);
    this.promoMessage.set(result.message);
    this.promoSuccess.set(result.success);
    this.promoDiscount.set(this.productsService.getPromoDiscount());

    // Clear message after 3 seconds
    setTimeout(() => {
      this.promoMessage.set('');
    }, 3000);
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }

  proceedToCheckout() {
    this.toastService.info('Checkout feature coming soon!');
    // Add checkout logic here
    console.log('Proceeding to checkout with items:', this.cartItems());
  }

  getItemTotal(product: Product): number {
    return product.price * (product.quantity || 1);
  }
}
