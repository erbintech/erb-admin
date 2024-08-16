import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CreditCard } from 'src/app/shared/models/credit-card';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';

@Component({
  selector: 'app-credit-card-detail',
  templateUrl: './credit-card-detail.component.html',
  styleUrls: ['./credit-card-detail.component.scss']
})
export class CreditCardDetailComponent implements OnInit {
  public token: string
  public alertMessage: string
  public creditCard = new CreditCard();

  constructor(
    private route: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private creditCardServcie: CreditCardService,
    private toastrService: ToastrService
  ) { }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    this.route.params.subscribe(async (params) => {
      let creditCardId = +params['id'];
      await this.getCreditCardById(creditCardId);
    });

  }

  private async getCreditCardById(creditCardId: number) {
    try {
      this.spinnerService.show();
      let res = await this.creditCardServcie.getCreditCardById(creditCardId, this.token)
      if (res && res.status == 200) {
        this.creditCard = res.recordList
      }
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error && error.error.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.toastrService.error(this.alertMessage);
    }
  }

}
