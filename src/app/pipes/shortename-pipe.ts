import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortename',
})
export class ShortenamePipe implements PipeTransform {
  transform(name: string): string {
    if (!name) return '';

    const names = name.trim().split(' ');

    // If only one word, return it
    if (names.length === 1) {
      return names[0].toUpperCase();
    }

    // If two or more words, return first two words
    return `${names[0]} ${names[1]}`.toUpperCase();
  }
}
