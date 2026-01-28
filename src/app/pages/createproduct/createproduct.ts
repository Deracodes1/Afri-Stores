import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products';
import { Product, CreateProductDto } from '../../models/products.model';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createproduct.html',
  styleUrls: ['./createproduct.css'],
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  successfullMessage = signal<string | null>(null);
  fb = inject(FormBuilder);
  ToastService = inject(ToastService);
  productService = inject(ProductsService);
  router = inject(Router);

  ngOnInit(): void {
    this.initForm();
    this.isProuductInStock();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(50)]],
      category: [''],
      image: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      inStock: [true, Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      properties: this.fb.array([], [Validators.required, Validators.minLength(1)]), // Dynamic properties array
    });
  }

  // Getter for properties FormArray
  get properties(): FormArray {
    return this.productForm.get('properties') as FormArray;
  }

  // Add new property field
  addProperty(): void {
    const propertyGroup = this.fb.group({
      key: ['', [Validators.required, Validators.minLength(2)]],
      value: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.properties.push(propertyGroup);
  }
  private isProuductInStock() {
    const stockAmount = this.productForm.get('stock');
    // subscribing to changes in the in-stock status and
    // validating(enbale/disable) stock amount field
    this.productForm.get('inStock')?.valueChanges.subscribe((inStock: boolean) => {
      if (inStock) {
        stockAmount?.enable();
      } else {
        stockAmount?.disable();
        stockAmount?.setValue(0);
      }
    });
  }
  // Remove property field at index
  removeProperty(index: number): void {
    this.properties.removeAt(index);
  }

  // Check if field has error and is touched
  hasError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Get specific error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must not exceed ${maxLength} characters`;
    }
    if (field.hasError('min')) {
      const min = field.errors?.['min'].min;
      return `${this.getFieldLabel(fieldName)} must be at least ${min}`;
    }
    if (field.hasError('pattern')) {
      return `${this.getFieldLabel(fieldName)} must be a valid URL starting with http:// or https://`;
    }
    return '';
  }

  // Get error for property fields
  getPropertyError(index: number, fieldName: string): string {
    const property = this.properties.at(index);
    const field = property.get(fieldName);

    if (!field || !field.invalid || (!field.dirty && !field.touched)) {
      return '';
    }

    if (field.hasError('required')) {
      return `${fieldName === 'key' ? 'Property name' : 'Property value'} is required`;
    }
    if (field.hasError('minlength')) {
      return `Must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }

  // Helper to get user-friendly field labels
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Product name',
      description: 'Description',
      price: 'Price',
      category: 'Category',
      image: 'Image URL',
      stock: 'Stock quantity',
    };
    return labels[fieldName] || fieldName;
  }

  // Get preview data for live preview
  get previewData() {
    return {
      name: this.productForm.get('name')?.value || 'Product Name Preview',
      description:
        this.productForm.get('description')?.value ||
        'Start typing the description field to see how your product copy will look to customers...',
      price: this.productForm.get('price')?.value || 0,
      image: this.productForm.get('image')?.value,
      inStock: this.productForm.get('inStock')?.value,
      stock: this.productForm.get('stock')?.value || 0,
      category: this.productForm.get('category')?.value || 'Electronics',
      properties: this.properties.value,
    };
  }

  // Handle form submission
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.productForm.controls).forEach((key) => {
      this.productForm.get(key)?.markAsTouched();
    });

    // Mark all property fields as touched
    this.properties.controls.forEach((group) => {
      Object.keys((group as FormGroup).controls).forEach((key) => {
        group.get(key)?.markAsTouched();
      });
    });
    if (this.productForm.invalid) {
      this.submitError.set('Please fix the errors above before submitting');
      return;
    }
    if (this.properties.invalid) {
      this.submitError.set('Please, you need to add at least one property');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    // Prepare product data using CreateProductDto model
    const formValue = this.productForm.value;
    const productData: CreateProductDto = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      image: formValue.image,
      inStock: formValue.inStock,
      stock: formValue.stock,
      category: formValue.category || undefined,
    };

    // Calling the addproduct method in the product service to
    // add the newly created product to the DB
    this.productService.addProduct(productData).subscribe({
      next: (createdProduct: Product) => {
        console.log('Product created successfully:', createdProduct);
        // show success message and Navigate back to products list(home page)
        this.ToastService.info('Product created successfully');
        this.successfullMessage.set('Product created successfully');
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (error) => {
        // console.error('Error creating product:', error);
        this.submitError.set('Failed to create product. Please try again.');
        this.ToastService.error('Product created successfully');
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  // Cancel and go back
  onCancel(): void {
    this.router.navigate(['/home']);
  }
}
