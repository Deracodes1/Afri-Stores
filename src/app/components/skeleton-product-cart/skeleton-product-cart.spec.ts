import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonProductCart } from './skeleton-product-cart';

describe('SkeletonProductCart', () => {
  let component: SkeletonProductCart;
  let fixture: ComponentFixture<SkeletonProductCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonProductCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonProductCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
