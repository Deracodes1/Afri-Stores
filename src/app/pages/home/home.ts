import { Component, inject, OnInit, signal, effect, untracked } from '@angular/core';
import { Product } from '../../models/products.model';
import { ProductsService } from '../../services/products';
import { ProductCardComponent } from '../../components/product-card-component/product-card-component';
import { SkeletonProductCard } from '../../components/skeleton-product-card/skeleton-product-card';
import { catchError } from 'rxjs';

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
    // Start loading
    this.isLoading.set(true);

    // Simulate data loading (remove when real API is added)
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1500);

    // Your existing API call (keep this for now)
    this.productsService
      .getADta()
      .pipe(
        catchError((err) => {
          console.error(err);
          // this.isLoading.set(false); // Stop loading on error
          throw err;
        }),
      )
      .subscribe((FakeProducts) => {
        console.log(FakeProducts);
        // When you have real products API:
        // this.isLoading.set(false);
      });
  }
}
