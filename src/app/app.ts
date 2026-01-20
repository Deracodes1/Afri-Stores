import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar-component/navbar-component';
import { Footer } from './components/footer/footer';
import { ToastComponent } from './components/toast/toast';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, Footer, ToastComponent, ScrollToTopComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = signal('Afri Mega Stores');
  namee = 'Dera Codes';
  name = 'Ezemenia Chidera Emmnauel';
  onclick() {
    this.title.set('Dera Stores');
    this.namee = 'Oderico';
  }
}
// add this code when start fetching data from a real api
// ngOnInit() {
//   this.isLoading.set(true);

//   // Real API call
//   this.http.get<Product[]>('/api/products').subscribe({
//     next: (products) => {
//       this.products = products;
//       this.isLoading.set(false);  // Hide skeleton
//     },
//     error: (err) => {
//       console.error(err);
//       this.isLoading.set(false);  // Still hide skeleton
//       this.toastService.error('Failed to load products');
//     }
//   });
// }
