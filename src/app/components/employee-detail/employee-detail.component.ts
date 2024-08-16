import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Dsa } from 'src/app/shared/models/dsa';
import { AdminPersonalLoanResponse } from 'src/app/shared/models/loans/adminPersonalLoanResponse';
import { DsaService } from 'src/app/shared/services/dsa.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  public token: string;
  public paramid: any;
  public dsa: Dsa[] = new Array<Dsa>();
  public dsas = new Dsa();
  public isAlert: boolean;
  public alertType: string;
  public alertMessage: string;
  public subdsas: Dsa[] = new Array<Dsa>();
  public subdsa = new Dsa
  public LoanDisplayColumns = ["id", "fullName", "serviceName", "loanAmount", "loanTransactionDate", "fatherContactNo", "motherName", "action"];
  public commissionDisplayColumns = ["id", "bankName", "commissionType", "serviceName", "commission"];
  public customersDisplayColumns = ["id", "fullName", "birthdate", "gender", "panCardNo", "temporaryCode", "action"];
  public walletColumns = ['id', 'coin', 'rewardType', 'isWithdrawal', 'createdDate'];
  public partnerCommissionColumn = ['id', 'type', 'createdDate', 'commission'];
  public leadDisplayColumn = ['id', 'name', 'contactNo', 'panCardNo', 'leadStatus', 'service', 'createdDate', 'loanAmount', 'assignpartner'];
  public OrderDisplayColumns = ['id', 'productName', 'quantity', 'unitCoin', 'totalcoin', 'orderstatus', 'transactiondate'];
  public service: string;
  public personalLoans: AdminPersonalLoanResponse[] = new Array<AdminPersonalLoanResponse>();
  public services: any;
  public selectedLoan
  public selectedServiceName: string;

  constructor(
    private spinnerService: NgxSpinnerService,
    private actRoute: ActivatedRoute,
    private dsaService: DsaService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");

    this.paramid = this.actRoute.snapshot.paramMap.get('id');
    let partnerId = this.paramid;
    this.paramid = partnerId; 

    await this.getPartnerDetailByPartnerId(partnerId);
    
  }

  public async getPartnerDetailByPartnerId(partnerId : number) {
    try {
      this.spinnerService.show();
      let res = await this.dsaService.getPartnerDetailByPartnerId(partnerId , this.token);
      if (res && res.status == 200) {
        if (res.recordList && res.recordList.length > 0)
          this.dsas = res.recordList[0];
          this.dsas.basicDetail.code = this.dsas.basicDetail.permanentCode ? this.dsas.basicDetail.permanentCode : this.dsas.basicDetail.temporaryCode
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
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

  public viewLoanDetail(ele) {
    let name = ele.serviceName.replace(/\s/g, '-')
    let route = name.toLowerCase() + '/view/' + ele.id;
    this.router.navigate([route]);
  }
 
  public navigateCustomerDetail(id: number) {
    this.router.navigate(["customer/view", id])
  }
}
