import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { NavbarComponent } from './components/navbar-component/navbar-component';
import { ProductCardComponent } from './components/product-card-component/product-card-component';
import { Product } from './products.model';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ProductCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Afri Mega Stores');
  products: Product[] = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description:
        'Experience crystal-clear sound with our premium wireless headphones. Features noise cancellation and 30-hour battery life for all-day listening.',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      description:
        ' Stay connected with our latest smartwatch. Track your fitness, receive notifications, and monitor your health with advanced sensors.',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'Laptop Stand Aluminum',
      description:
        'Ergonomic laptop stand made from premium aluminum. Adjustable height and angle for optimal viewing comfort during long work sessions',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=400&fit=crop',
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      description:
        ' Professional mechanical keyboard with RGB backlight. Tactile switches provide satisfying typing experience perfect for gaming and productivity.',
      price: 159.99,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=400&fit=crop',
    },
    {
      id: 5,
      name: 'Wireless MouseErgonomic wireless',
      description:
        'wireless mouse with precision tracking. Rechargeable battery lasts up to 3 months on a single charge for uninterrupted work.',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=400&fit=crop',
    },
    {
      id: 6,
      name: 'USB-C Hub Adapter',
      description:
        'Expand your connectivity with 7-in-1 USB-C hub. Includes HDMI, USB 3.0, SD card reader, and power delivery for ultimate versatility.',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=400&fit=crop',
    },
  ];
  selectedProducts: Product[] = [];
  NumOfSelelctedProducts = signal<number | string>(this.selectedProducts.length);
  filteredProducts: Product[] = [...this.products];
  updateSelectedProductsArray(incomingProductObject: Product) {
    const index = this.selectedProducts.findIndex((p) => p.id === incomingProductObject.id);
    if (index > -1) {
      // Product exists - remove it
      this.selectedProducts.splice(index, 1);
      this.NumOfSelelctedProducts.set(this.selectedProducts.length);
    } else {
      // Product doesn't exist - add it
      this.selectedProducts.push(incomingProductObject);
      this.NumOfSelelctedProducts.set(this.selectedProducts.length);
    }
  }
  isProductSelected(productId: number): boolean {
    return this.selectedProducts.some((p) => p.id === productId);
  }

  onSearch(searchTerm: string) {
    if (searchTerm.trim() === '') {
      // If search is empty, show all products
      this.filteredProducts = [...this.products];
    } else {
      // Filter products based on search term
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }
}
