import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[ContactNo]'
})
export class ContactNoDirective {
    private regex = /^((\\+91-?)|0)?[0-9]{1,10}$/;

    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        
        if (["Backspace", "Tab", "End", "Home"].indexOf(event.key) !== -1)
            return;

        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        console.log(this.regex.test(next));
        
        if (next && !this.regex.test(next))
            event.preventDefault();
    }
}