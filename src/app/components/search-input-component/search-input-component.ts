import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';
@Component({
  selector: 'app-search-input-component',
  imports: [FormsModule],
  templateUrl: './search-input-component.html',
  styleUrl: './search-input-component.css',
})
export class SearchInputComponent {
  searchedProduct: string = '';
  // Inject the service
  private productsService = inject(ProductsService);
  // Handle search input
  onSearchInput() {
    this.productsService.onSearch(this.searchedProduct);
  }
}
