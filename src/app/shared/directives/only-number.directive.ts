import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {
  public allow = [];
  constructor(private element: ElementRef) {
    const allowAttr = element.nativeElement.attributes['allow'];
    if (element.nativeElement.attributes['allow']) {
      this.allow = element.nativeElement.attributes['allow'].nodeValue.split(',').map(char => char.charCodeAt());
    }

  }

  @HostListener('keypress', ['$event']) onChangeInput(input): void {

    this.allow.push(48);
    const key = input.keyCode;
    const currentValue = this.element.nativeElement.value;
    if (
      key < 48
      || key > 57
      || (key === 48 && currentValue.trim().length === 0 )) {
      input.preventDefault();
    } else if (this.allow.indexOf(key) > -1 && currentValue.trim().length > 0 && currentValue.indexOf(input.key) === -1) {

    }
  }

}
