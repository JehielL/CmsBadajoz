import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasListComponent } from './rutas-list.component';

describe('RutasListComponent', () => {
  let component: RutasListComponent;
  let fixture: ComponentFixture<RutasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RutasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
