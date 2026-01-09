import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../products.model';
import { ProductsService } from '../services/products';
import { ProductCardComponent } from '../components/product-card-component/product-card-component';
import { catchError } from 'rxjs';
@Component({
  selector: 'app-home',
  imports: [ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Inject the service
  private productsService = inject(ProductsService);

  // Expose service data to template
  filteredProducts = this.productsService.filteredProducts;
  // Handle add to cart click from product card
  onAddToCart(product: Product) {
    this.productsService.updateSelectedProductsArray(product);
  }

  // Check if product is selected
  isProductSelected(productId: number): boolean {
    return this.productsService.isProductSelected(productId);
  }
  ngOnInit(): void {
    console.log(
      this.productsService
        .getADta()
        .pipe(
          catchError((err) => {
            console.error(err);
            throw err;
          })
        )
        .subscribe((currentYear) => {
          console.log(currentYear);
        })
    );
  }
}
