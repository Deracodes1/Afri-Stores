import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prefrences } from './prefrences';

describe('Prefrences', () => {
  let component: Prefrences;
  let fixture: ComponentFixture<Prefrences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prefrences]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prefrences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
