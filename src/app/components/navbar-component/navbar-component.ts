import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StateService } from '../../services/state.service.ts';
import { Observable } from 'rxjs';
import { SearchInputComponent } from "../search-input-component/search-input-component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchInputComponent],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css'],
})
export class NavbarComponent {
  private stateService = inject(StateService);

  // App title
  title = signal('ShopHub');

  // Mobile menu state
  mobileMenuOpen = signal(false);

  // Cart count from StateService - Observable
  cartCount$: Observable<number> = this.stateService.cartItemCount$;

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
