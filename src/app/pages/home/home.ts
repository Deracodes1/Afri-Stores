import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products';
import { StateService } from '../../services/state.service.ts';
import { ProductCardComponent } from '../../components/product-card-component/product-card-component';
import { SkeletonProductCard } from '../../components/skeleton-product-card/skeleton-product-card';
import { ToastService } from '../../services/toast';
import { Observable } from 'rxjs';
import { Product } from '../../models/products.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent, SkeletonProductCard, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private productsService = inject(ProductsService);
  private stateService = inject(StateService);
  private toastService = inject(ToastService);

  // Observables from StateService - use with async pipe in template
  products$: Observable<Product[]> = this.stateService.products$;
  loading$: Observable<boolean> = this.stateService.loading$;
  error$: Observable<string | null> = this.stateService.error$;
  cart$: Observable<Product[]> = this.stateService.cart$;

  ngOnInit(): void {
    // Set loading to true
    this.stateService.setLoading(true);
    this.stateService.clearError();

    // Fetch products from API
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.stateService.setProducts(data);
        this.stateService.setLoading(false);
        this.toastService.success('Products loaded successfully!');
      },
      error: (errorMessage: string) => {
        // errorMessage is already user-friendly from ErrorHandlerService
        this.stateService.setError(errorMessage);
        this.stateService.setLoading(false);
        this.toastService.error(errorMessage);
      },
    });
  }

  /**
   * Check if product is in cart - returns Observable
   */
  isProductInCart(productId: number): Observable<boolean> {
    return this.stateService.isInCart$(productId);
  }

  /**
   * Toggle product in cart
   */
  toggleProductInCart(product: Product): void {
    // Check current cart state
    const currentCart = this.stateService.getStateSnapshot().cart;
    const isInCart = currentCart.some((p) => p.id === product.id);

    if (isInCart) {
      this.stateService.removeFromCart(product.id);
      this.toastService.info(`${product.name} removed from cart`);
    } else {
      this.stateService.addToCart(product);
      this.toastService.success(`${product.name} added to cart!`);
    }
  }

  /**
   * Retry loading products
   */
  retryLoadProducts(): void {
    this.ngOnInit();
  }
}
