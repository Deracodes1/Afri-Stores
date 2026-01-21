import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonProductCard } from './skeleton-product-card';

describe('SkeletonProductCart', () => {
  let component: SkeletonProductCard;
  let fixture: ComponentFixture<SkeletonProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonProductCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
