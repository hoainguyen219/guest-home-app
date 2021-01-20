import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNoneAutocomplete]'
})
export class NoneAutocompleteDirective implements OnInit {

  constructor(private element: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.element.nativeElement, 'Autocomplete');
    console.log(this.element);
  }

}
