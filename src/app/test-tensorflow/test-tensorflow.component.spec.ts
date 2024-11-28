import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTensorflowComponent } from './test-tensorflow.component';

describe('TestTensorflowComponent', () => {
  let component: TestTensorflowComponent;
  let fixture: ComponentFixture<TestTensorflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTensorflowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTensorflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
