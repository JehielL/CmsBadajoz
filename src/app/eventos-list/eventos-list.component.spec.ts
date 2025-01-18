import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosListComponent } from './eventos-list.component';
import { LazyLoadDirective } from '../lazy-load.directive';

describe('EventosListComponent', () => {
  let component: EventosListComponent;
  let fixture: ComponentFixture<EventosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosListComponent, LazyLoadDirective]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
