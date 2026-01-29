import { Component, inject, input, output } from '@angular/core';
import { Product } from '../../models/products.model';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products';
@Component({
  selector: 'app-product-card-component',
  imports: [],
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.css',
})
export class ProductCardComponent {
  product = input.required<Product>();
  router = inject(Router);
  productService = inject(ProductsService);
  isSelectedState = input<boolean>();
  // Handle add to cart click from product card
  AddToCart(event: MouseEvent, product: Product) {
    event.stopImmediatePropagation();
    const productWithQuantity = { ...product, quantity: 1 };
    this.productService.updateSelectedProductsArray(productWithQuantity);
  }
  openProductPage() {
    this.router.navigate(['/product', this.product().id], {
      queryParams: {
        category: this.product().category,
      },
    });
  }
}
