import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTaskCreation } from './test-task-creation';

describe('TestTaskCreation', () => {
  let component: TestTaskCreation;
  let fixture: ComponentFixture<TestTaskCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTaskCreation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTaskCreation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
