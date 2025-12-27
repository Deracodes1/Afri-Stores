import { Component, input, output } from '@angular/core';
import { Product } from '../../products.model';
@Component({
  selector: 'app-product-card-component',
  imports: [],
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.css',
})
export class ProductCardComponent {
  product = input.required<Product>();
  outgoingData = output<Product>();
  isSelectedState = input<boolean>();
  sendClickedProduct() {
    this.outgoingData.emit(this.product());
  }
}
