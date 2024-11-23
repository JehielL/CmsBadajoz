import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosbadajozComponent } from './eventosbadajoz.component';

describe('EventosbadajozComponent', () => {
  let component: EventosbadajozComponent;
  let fixture: ComponentFixture<EventosbadajozComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosbadajozComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosbadajozComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
