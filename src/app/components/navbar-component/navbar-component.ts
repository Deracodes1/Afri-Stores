import { Component, input, output, signal } from '@angular/core';
import { SearchInputComponent } from '../search-input-component/search-input-component';

@Component({
  selector: 'app-navbar-component',
  imports: [SearchInputComponent],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  title = input('');
  recievedSearchTerm = output<string>();
  NumOfSelectedProducts = input<string | number>(0);
  sendSearchTerm(searchValue: string) {
    this.recievedSearchTerm.emit(searchValue);
  }
}
