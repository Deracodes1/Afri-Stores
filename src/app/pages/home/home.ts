import { Component, inject, OnInit, signal, effect, untracked } from '@angular/core';
import { ProductsService } from '../../services/products';
import { ProductCardComponent } from '../../components/product-card-component/product-card-component';
import { SkeletonProductCard } from '../../components/skeleton-product-card/skeleton-product-card';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, SkeletonProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Inject the service
  private productsService = inject(ProductsService);

  // Loading state
  isLoading = signal(true);
  // injecting toast service for notifications
  toastService = inject(ToastService);
  // Expose service data to template
  filteredProducts = this.productsService.filteredProducts;

  // Check if product is selected
  isProductSelected(productId: number): boolean {
    return this.productsService.isProductSelected(productId);
  }
  // Listen to search changes
  private searchEffect = effect(() => {
    const term = this.productsService.searchTerm();
    // don't run the effect(laoding skeletons) if search term is empty
    if (!term) return;
    untracked(() => {
      this.isLoading.set(false);
    });

    // show loading skeleton during search(search term is not empty)
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 300);
  });

  ngOnInit(): void {
    this.isLoading.set(true);

    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.productsService.products.set(data);
        setTimeout(() => this.isLoading.set(false), 1500);
      },
      error: (err) => {
        this.toastService.error(`Error fetching products: ${err.message}`);
        console.error('Error fetching products:', err);
        this.isLoading.set(false);
      },
    });
  }
}
