import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../models/products.model';
import { ProductsService } from '../../services/products';
import { StarRatingComponent } from '../../components/star-rating/star-rating';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { ProductCardComponent } from '../../components/product-card-component/product-card-component';
import { getInitials } from '../../utils/string-utils';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StarRatingComponent,
    RelativeTimePipe,
    ProductCardComponent,
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);

  // Product data
  product = signal<Product | null>(null);

  // Main display image
  mainImage = signal<string>('');

  // Quantity selector
  quantity = signal<number>(1);

  // Related products
  relatedProducts = signal<Product[]>([]);

  // Loading state
  isLoading = signal<boolean>(true);

  // Star distribution for reviews
  starDistribution = computed(() => {
    const prod = this.product();
    if (!prod || !prod.reviews.length) return [];

    const total = prod.reviews.length;
    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = prod.reviews.filter((r) => r.rating === stars).length;
      const percentage = (count / total) * 100;
      return { stars, count, percentage };
    });

    return distribution;
  });

  ngOnInit() {
    // Subscribe to route params to get the product ID
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      this.loadProduct(id);
    });
  }

  /**
   * Load product data by ID
   */
  loadProduct(productId: number) {
    this.isLoading.set(true);

    // Scroll to top when loading new product
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.productsService.getProductById(productId).subscribe({
      next: (data) => {
        this.product.set(data);
        this.mainImage.set(data.images[0] || data.image);
        this.quantity.set(1);
        this.isLoading.set(false);

        // Load related products
        const related = this.productsService.getRelatedProducts(data.id, 4);
        this.relatedProducts.set(related);
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.isLoading.set(false);
        // Product not found - redirect to 404
        this.router.navigate(['/404']);
      },
    });
  }

  /**
   * Change main image
   */
  selectImage(imageUrl: string) {
    this.mainImage.set(imageUrl);
  }

  // Check if product is selected
  isProductSelected(productId: number): boolean {
    return this.productsService.isProductSelected(productId);
  }

  /**
   * Increase quantity
   */
  increaseQuantity() {
    const prod = this.product();
    if (prod && this.quantity() < prod.stock) {
      this.quantity.set(this.quantity() + 1);
    }
  }

  /**
   * Decrease quantity
   */
  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  /**
   * Add to cart
   */
  addToCart() {
    const prod = this.product();
    if (prod) {
      // Add product with selected quantity
      const productWithQuantity = { ...prod, quantity: this.quantity() };
      this.productsService.updateSelectedProductsArray(productWithQuantity);
    }
  }

  /**
   * View related product
   */
  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  /**
   * View all products in same category
   */
  viewAllInCategory() {
    const prod = this.product();
    if (prod && prod.category) {
      this.router.navigate(['/home'], {
        queryParams: { category: prod.category },
      });
    } else {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Calculate former price (18% higher)
   */
  getFormerPrice(actualPrice: number): number {
    return actualPrice * 1.18;
  }

  /**
   * Get reviewer initials
   */
  getReviewerInitials(name: string): string {
    return getInitials(name);
  }

  /**
   * Check if product is in cart
   */
  isInCart(): boolean {
    const prod = this.product();
    return prod ? this.productsService.isProductSelected(prod.id) : false;
  }
}
