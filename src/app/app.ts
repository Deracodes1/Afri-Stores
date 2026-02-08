import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar-component/navbar-component';
import { Footer } from './components/footer/footer';
import { ToastComponent } from './components/toast/toast';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top';
import { TestTaskCreation } from './test-task-creation/test-task-creation';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    Footer,
    ToastComponent,
    ScrollToTopComponent,
    TestTaskCreation,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = signal('Afri Mega Stores');
}
