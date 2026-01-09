import { Component, input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products';
import { SearchInputComponent } from '../search-input-component/search-input-component';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-navbar-component',
  imports: [SearchInputComponent, RouterLink],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  title = input('');
  // Inject the service
  private productsService = inject(ProductsService);
  private authService = inject(AuthService);

  // checks if user is logged in
  isLoggedIn = this.authService.isLoggedIn;
  // get the cart count from the inject product service
  cartCount = this.productsService.NumOfSelectedProducts;
  // Mobile menu state
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    console.log(this.cartCount);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
