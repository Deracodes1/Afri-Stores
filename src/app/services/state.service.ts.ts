import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/products.model';

export interface AppState {
  products: Product[];
  cart: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  products: [],
  cart: [],
  loading: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // Private BehaviorSubject to hold the state
  private state$ = new BehaviorSubject<AppState>(initialState);

  // Public Observable - read-only access to state
  public readonly state: Observable<AppState> = this.state$.asObservable();

  // Selectors - expose specific slices of state as Observables
  public readonly products$: Observable<Product[]> = this.state.pipe(
    map((state) => state.products),
  );

  public readonly cart$: Observable<Product[]> = this.state.pipe(map((state) => state.cart));

  public readonly loading$: Observable<boolean> = this.state.pipe(map((state) => state.loading));

  public readonly error$: Observable<string | null> = this.state.pipe(map((state) => state.error));

  // Computed selectors
  public readonly cartItemCount$: Observable<number> = this.cart$.pipe(
    map((cart) => cart.reduce((total, product) => total + (product.quantity || 1), 0)),
  );

  public readonly cartSubtotal$: Observable<number> = this.cart$.pipe(
    map((cart) =>
      cart.reduce((total, product) => total + product.price * (product.quantity || 1), 0),
    ),
  );

  // Methods to update state immutably

  /**
   * Set all products in state
   */
  setProducts(products: Product[]): void {
    this.updateState({ products });
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.updateState({ error });
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.updateState({ error: null });
  }

  /**
   * Add product to cart
   */
  addToCart(product: Product): void {
    const currentState = this.state$.getValue();
    const existingProduct = currentState.cart.find((p) => p.id === product.id);

    if (existingProduct) {
      // Product already in cart - update quantity
      const updatedCart = currentState.cart.map((p) =>
        p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p,
      );
      this.updateState({ cart: updatedCart });
    } else {
      // Add new product to cart
      const updatedCart = [...currentState.cart, { ...product, quantity: 1 }];
      this.updateState({ cart: updatedCart });
    }
  }

  /**
   * Remove product from cart
   */
  removeFromCart(productId: number): void {
    const currentState = this.state$.getValue();
    const updatedCart = currentState.cart.filter((p) => p.id !== productId);
    this.updateState({ cart: updatedCart });
  }

  /**
   * Update product quantity in cart
   */
  updateCartQuantity(productId: number, quantity: number): void {
    const currentState = this.state$.getValue();
    const updatedCart = currentState.cart.map((p) => (p.id === productId ? { ...p, quantity } : p));
    this.updateState({ cart: updatedCart });
  }

  /**
   * Check if product is in cart
   */
  isInCart$(productId: number): Observable<boolean> {
    return this.cart$.pipe(map((cart) => cart.some((p) => p.id === productId)));
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this.updateState({ cart: [] });
  }

  /**
   * Add a single product to products list
   */
  addProduct(product: Product): void {
    const currentState = this.state$.getValue();
    const updatedProducts = [...currentState.products, product];
    this.updateState({ products: updatedProducts });
  }

  /**
   * Private helper method to update state immutably
   */
  private updateState(partialState: Partial<AppState>): void {
    const currentState = this.state$.getValue();
    this.state$.next({
      ...currentState,
      ...partialState,
    });
  }

  /**
   * Get current state snapshot (use sparingly, prefer observables)
   */
  getStateSnapshot(): AppState {
    return this.state$.getValue();
  }
}
