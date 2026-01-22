import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../models/products.model';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // All products data
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
        'Stay connected with our latest smartwatch. Track your fitness, receive notifications, and monitor your health with advanced sensors.',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'Laptop Stand Aluminum',
      description:
        'Ergonomic laptop stand made from premium aluminum. Adjustable height and angle for optimal viewing comfort during long work sessions.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=400&fit=crop',
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      description:
        'Professional mechanical keyboard with RGB backlight. Tactile switches provide satisfying typing experience perfect for gaming and productivity.',
      price: 159.99,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=400&fit=crop',
    },
    {
      id: 5,
      name: 'Wireless Mouse',
      description:
        'Ergonomic wireless mouse with precision tracking. Rechargeable battery lasts up to 3 months on a single charge for uninterrupted work.',
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
  http = inject(HttpClient);
  getADta() {
    return this.http.get('https://jsonplaceholder.typicode.com/todos ');
  }
  private toastService = inject(ToastService);
  // Cart/Selected products
  private selectedProducts = signal<Product[]>([]);

  // Search term signal
  searchTerm = signal<string>('');

  // Promo code
  private promoCode = signal<string>('');
  private promoDiscount = signal<number>(0); // percentage discount

  // Number of selected products signal
  NumOfSelectedProducts = computed((): number | undefined => {
    const currentQunatity = this.selectedProducts()
      .map((product) => product.quantity)
      .reduce((accu, curVal) => {
        return accu! + curVal!;
      }, 0);
    return currentQunatity;
  });
  // Computed filtered products based on search term
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (term === '') {
      return this.products;
    }

    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term),
    );
  });

  // Search method - updates the search term signal
  onSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm);
  }

  // Add/Remove product from cart
  updateSelectedProductsArray(incomingProductObject: Product) {
    const currentCart = this.selectedProducts(); // Get current array
    const index = currentCart.findIndex((p) => p.id === incomingProductObject.id);

    if (index > -1) {
      // Product exists - remove it (create new array without this product)
      const newCart = currentCart.filter((p) => p.id !== incomingProductObject.id);
      this.selectedProducts.set(newCart); // ← Set new array!
      this.toastService.info(`${incomingProductObject.name} was removed from cart`);
    } else {
      // Product doesn't exist - add it with quantity 1 (create new array with this product)
      const newCart = [...currentCart, { ...incomingProductObject, quantity: 1 }];
      this.selectedProducts.set(newCart); // ← Set new array!
      this.toastService.success(`${incomingProductObject.name} added to cart!`);
    }
  }

  // Check if a product is selected
  isProductSelected(productId: number): boolean {
    return this.selectedProducts().some((p) => p.id === productId);
  }

  // Get all selected products (useful for cart page later)
  getSelectedProducts(): Product[] {
    return [...this.selectedProducts()];
  }
  // Update product quantity in cart
  updateQuantity(productId: number, newQuantity: number) {
    // ← HERE!
    const currentCart = this.selectedProducts();
    const updatedCart = currentCart.map((product) =>
      product.id === productId ? { ...product, quantity: newQuantity } : product,
    );
    this.selectedProducts.set(updatedCart);
  }

  // Remove product from cart
  removeFromCart(productId: number) {
    const currentCart = this.selectedProducts();
    const product = currentCart.find((p) => p.id === productId);
    const updatedCart = currentCart.filter((p) => p.id !== productId);
    this.selectedProducts.set(updatedCart);

    this.toastService.info(`${product!.name} removed from cart`); // Add toast
  }
  // Computed cart totals
  cartSubtotal = computed(() => {
    return this.selectedProducts().reduce((total, product) => {
      return total + product.price * (product.quantity || 1);
    }, 0);
  });
  // Apply promo code
  applyPromoCode(code: string) {
    this.promoCode.set(code.toUpperCase());

    // Simple promo code logic
    if (code.toUpperCase() === 'SAVE10') {
      this.promoDiscount.set(10);
      this.toastService.success('10% discount applied!');
      return { success: true, message: '10% discount applied!' };
    } else if (code.toUpperCase() === 'SAVE20') {
      this.promoDiscount.set(20);
      this.toastService.success('20% discount applied!');
      return { success: true, message: '20% discount applied!' };
    } else if (code === '') {
      this.promoDiscount.set(0);
      return { success: false, message: '' };
    } else {
      this.toastService.error('Invalid promo code'); // Add toast
      return { success: false, message: 'Invalid promo code' };
    }
  }

  // Get current promo discount
  getPromoDiscount() {
    return this.promoDiscount();
  }

  cartTax = computed(() => {
    return this.cartSubtotal() * 0.075; // 7.5% tax
  });

  cartTotal = computed(() => {
    const subtotal = this.cartSubtotal();
    const tax = this.cartTax();
    const discount = (subtotal * this.promoDiscount()) / 100;
    return subtotal + tax - discount;
  });

  // Clear cart (useful for checkout)
  clearCart() {
    this.selectedProducts.set([]);
    this.promoCode.set('');
    this.promoDiscount.set(0);
  }
}
