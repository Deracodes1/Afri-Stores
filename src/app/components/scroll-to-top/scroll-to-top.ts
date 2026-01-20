import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.html',
  styleUrls: ['./scroll-to-top.css'],
})
export class ScrollToTopComponent {
  // Show button when scrolled down 300px
  showButton = signal(false);

  /**
   * Listen to window scroll event
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Show button if scrolled more than 300px
    this.showButton.set(window.scrollY > 300);
  }

  /**
   * Scroll to top smoothly
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
