import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokyoHomeComponent } from './tokyo-home.component';

describe('TokyoHomeComponent', () => {
  let component: TokyoHomeComponent;
  let fixture: ComponentFixture<TokyoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokyoHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokyoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
