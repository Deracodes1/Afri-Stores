import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();
  title = input<string>();
  // Social media links
  socialLinks = [
    { name: 'Facebook', icon: 'fa-brands fa-facebook', url: 'https://facebook.com' },
    { name: 'Twitter', icon: 'fa-brands fa-twitter', url: 'https://twitter.com' },
    { name: 'Instagram', icon: 'fa-brands fa-instagram', url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: 'fa-brands fa-linkedin', url: 'https://linkedin.com' },
  ];

  // Quick links
  shopLinks = [
    { label: 'All Products', route: '/home' },
    { label: 'New Arrivals', route: '/home' },
    { label: 'Best Sellers', route: '/home' },
    { label: 'Deals', route: '/home' },
  ];

  customerLinks = [
    { label: 'My Account', route: '/account' },
    { label: 'Order Tracking', route: '/account' },
    { label: 'Wishlist', route: '/wishlist' },
    { label: 'Shopping Cart', route: '/cart' },
  ];

  supportLinks = [
    { label: 'Contact Us', route: '/contact' },
    { label: 'FAQs', route: '/faq' },
    { label: 'Shipping Info', route: '/shipping' },
    { label: 'Returns', route: '/returns' },
  ];
}
