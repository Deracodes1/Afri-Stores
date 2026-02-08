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
  // get the error message from the signal
  productErrorMsg = this.productsService.productErrorMsg;
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
    // show the (laoding skeletons) if search term is falsy and deos not match any product
    if (!term) return;
    untracked(() => {
      this.isLoading.set(false);
    });

    // show loading skeleton during search(search term is not empty)
    this.isLoading.set(true);
    this.productErrorMsg.set('Try searching for something else');
    setTimeout(() => this.isLoading.set(false), 300);
  });

  ngOnInit(): void {
    this.initialLoad();
  }
  initialLoad() {
    this.isLoading.set(true);
    this.productErrorMsg.set('please refresh page');
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.productsService.products.set(data);
        this.isLoading.set(false);
        this.toastService.success('Products loaded successfully!');
      },
      error: (err) => {
        this.toastService.error(err);
        this.isLoading.set(false);
        this.productErrorMsg.set(err);
      },
    });
  }
  retryLoadProducts(): void {
    this.initialLoad();
  }
}
