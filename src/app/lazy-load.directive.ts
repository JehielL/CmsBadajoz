import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true, 
})
export class LazyLoadDirective implements OnInit {
  @Input('appLazyLoad') imageUrl!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundImage', `url(${this.imageUrl})`);
        observer.disconnect();
      }
    });

    observer.observe(this.el.nativeElement);
  }
}
