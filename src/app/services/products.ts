import { Injectable, inject } from '@angular/core';
import { Product, CreateProductDto } from '../models/products.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler-service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private apiUrl = 'http://localhost:3000/products';

  /**
   * Get all products with error handling
   */
  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Get single product by ID with error handling
   */
  getProductById(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Add product to database with error handling
   */
  addProduct(productDto: CreateProductDto): Observable<Product> {
    const fullProduct: Omit<Product, 'id'> = {
      name: productDto.name,
      description: productDto.description,
      price: productDto.price,
      image: productDto.image,
      inStock: productDto.inStock,
      stock: productDto.stock,
      category: productDto.category || '',
      images: [productDto.image],
      rating: 0,
      totalReviews: 0,
      reviews: [],
    };

    return this.http
      .post<Product>(this.apiUrl, fullProduct)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Update product with error handling
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http
      .put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Delete product with error handling
   */
  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
}
