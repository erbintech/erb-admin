import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/shared/models/customer';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  public token: string;
  private alertMessage: string;
  public customer = new Customer();
  public LoanDisplayColumns = ['id', 'serviceName', 'loanAmount', 'disbursedAmount', 'emi', 'ROI', 'tenure', 'loanTransactionDate', 'status', 'action'];
  public leadDisplayColumn = ['id', 'type', 'serviceName', 'leadStatus', 'loanAmount', 'assignPartner', 'assignOn', 'createdDate'];
  public walletColumns = ['id', 'coin', 'rewardType', 'isWithdrawal', 'createdDate'];
  public OtherLoanDisplayColumns = ['id', 'serviceType', 'serviceName', 'fullName', 'contactNo', 'createdDate', 'employmentType'];
  public OrderDisplayColumns = ['id', 'productName', 'quantity', 'unitCoin', 'totalcoin', 'orderstatus', 'transactiondate'];
  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
  ) { }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    let customerId = this.actRoute.snapshot.paramMap.get('id');
    await this.getCustomerById(customerId);
  }

  public async getCustomerById(customerId) {
    try {
      let res = await this.customerService.getCustomerById(customerId, this.token);
      if (res && res.status == 200) {
        this.customer = res.recordList;
      }
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public viewLoanDetail(ele) {
    if (ele.serviceId == 2) {
      this.router.navigate(["business-loan/view/", ele.id]);
    }
    else if (ele.serviceId == 7) {
      this.router.navigate(["home-loan/view/", ele.id]);
    }
    else if (ele.serviceId == 9) {
      this.router.navigate(["LAP/view/", ele.id]);
    }
    else if (ele.serviceId == 1) {
      this.router.navigate(["personal-loan/view/", ele.id]);
    }
    else if (ele.serviceId == 4) {
      this.router.navigate(["instant-loan/view/", ele.id]);
    }
  }
}
