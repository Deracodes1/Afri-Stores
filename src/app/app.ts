import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar-component/navbar-component';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, Footer],
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
