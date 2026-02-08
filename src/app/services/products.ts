import { Injectable, signal, computed, inject } from '@angular/core';
import { Product, CreateProductDto } from '../models/products.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from './error-handler-service';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // All products data
  products = signal<Product[]>([]);
  // products error message
  productErrorMsg = signal('');
  errorHandler = inject(ErrorHandlerService);
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/products';

  // Get all products
  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  // Get single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error)));
  }

  //  For adding products to the DB
  addProduct(productDto: CreateProductDto): Observable<Product> {
    const fullProduct: Omit<Product, 'id'> = {
      // From DTO object gotten from the product creation page i am patching up some data that was
      // not asked for when creating a new product but is needed to post to the db inorder to
      //  match other existing properties.
      name: productDto.name,
      description: productDto.description,
      price: productDto.price,
      image: productDto.image,
      inStock: productDto.inStock,
      stock: productDto.stock,
      category: productDto.category || '',

      // these are properties are patched up to make the object compatible with
      // existing products
      images: [productDto.image],
      rating: 0,
      totalReviews: 0,
      reviews: [],
    };

    return this.http.post<Product>(this.apiUrl, fullProduct);
  }

  // // method for Updating product
  // updateProduct(id: number, product: Product): Observable<Product> {
  //   return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  // }

  // //method for deleting product
  // deleteProduct(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }

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
      return this.products();
    }

    return this.products().filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term),
    );
  });

  // Search method - updates the search term signal
  onSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm);
  }
  /**
   * Get product by ID

  /**
   * Get related products by category (excluding current product)
   */
  getRelatedProducts(productId: number, limit: number = 4): Product[] {
    const allProducts = this.products(); // Get products from signal
    const currentProduct = allProducts.find((p) => p.id === productId);

    if (!currentProduct || !currentProduct.category) {
      return [];
    }

    return allProducts
      .filter((p) => p.category === currentProduct.category && p.id !== productId)
      .slice(0, limit);
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
      // Product doesn't exist - add it (create new array with this product)
      const newCart = [...currentCart, { ...incomingProductObject }];
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
