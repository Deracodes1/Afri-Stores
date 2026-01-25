import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.html',
  styleUrls: ['./star-rating.css'],
})
export class StarRatingComponent {
  // Rating value (0-5)
  rating = input.required<number>();

  // Size of stars
  size = input<'sm' | 'md' | 'lg'>('md');

  // Show rating number
  showNumber = input<boolean>(false);

  /**
   * Get array of star states (full, half, empty)
   */
  getStars(): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const rating = this.rating();

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('full');
      } else if (rating >= i - 0.5) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }

    return stars;
  }

  /**
   * Get star icon class based on state
   */
  getStarClass(state: 'full' | 'half' | 'empty'): string {
    if (state === 'full') return 'fa-solid fa-star';
    if (state === 'half') return 'fa-solid fa-star-half-stroke';
    return 'fa-regular fa-star';
  }

  /**
   * Get size class
   */
  getSizeClass(): string {
    switch (this.size()) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-2xl';
      default:
        return 'text-lg';
    }
  }
}
