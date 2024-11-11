import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustombarComponent } from './custombar.component';

describe('CustombarComponent', () => {
  let component: CustombarComponent;
  let fixture: ComponentFixture<CustombarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustombarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustombarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
