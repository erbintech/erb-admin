import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() alertType: string;
  @Input() alertErrorMessage: string;
  public alertClosed: boolean = false

  ngOnInit(): void {
    
    setTimeout(() => {
      this.alertClosed = true;
    }, 2000);
  }

}
