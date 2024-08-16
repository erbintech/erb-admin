import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class ToggleMenuService {
    constructor() { }
    public toggleMenuStyles() {
        const modalContent = document.querySelector('.mat-mdc-menu-content');
        sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
    }
    public togglePickerStyles() {
        const modalContent = document.querySelector('.mat-calendar');
        if (modalContent) {
            if (sessionStorage.getItem('dark-mode') == 'dark-only')
                modalContent.classList.add('dark-only-modal')
            else
                modalContent.classList.remove('dark-only-modal')
        }
    }
}