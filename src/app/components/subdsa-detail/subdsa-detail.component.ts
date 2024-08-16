import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dsa } from 'src/app/shared/models/dsa';
import { AdminPersonalLoanResponse } from 'src/app/shared/models/loans/adminPersonalLoanResponse';
import { DsaService } from 'src/app/shared/services/dsa.service';

@Component({
  selector: 'app-subdsa-detail',
  templateUrl: './subdsa-detail.component.html',
  styleUrls: ['./subdsa-detail.component.scss']
})

export class SubdsaDetailComponent implements OnInit {
  public token: string;
  public paramid: any;
  public dsas = new Dsa();
  public isAlert: boolean;
  public alertType: string;
  public alertMessage: string;
  public subdsas: Dsa[] = new Array<Dsa>();
  public subdsa = new Dsa
  public LoanDisplayColumns = ["id", "fullName", "serviceName", "loanAmount", "loanTransactionDate", "motherName", "action"];
  public commissionDisplayColumns = ["id", "bankName", "commissionType", "serviceName", "commission"];
  public customersDisplayColumns = ["id", "fullName", "birthdate", "gender", "panCardNo", "temporaryCode", "action"];
  public employeeColumns = ['id', 'code', 'fullName', 'panCardNo', 'gender', 'city', 'companyType', 'companyName', 'createdDate', 'action'];
  public groupColumns = ['id', 'code', 'fullName', 'panCardNo', 'gender', 'city', 'companyType', 'companyName', 'createdDate', 'role', 'action'];
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
    private toasterService: ToastrService
  ) { }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");

    this.paramid = this.actRoute.snapshot.paramMap.get('id');
    let partnerId = this.paramid;
    this.paramid = partnerId;

    await this.getPartnerDetailByPartnerId(partnerId);

  }

  public async getPartnerDetailByPartnerId(partnerId: number) {
    try {
      this.spinnerService.show();
      let res = await this.dsaService.getPartnerDetailByPartnerId(partnerId, this.token);
      if (res && res.status == 200) {
        if (res.recordList && res.recordList.length > 0)
          this.dsas = res.recordList[0];
          this.dsas.basicDetail.code = this.dsas.basicDetail.permanentCode ? this.dsas.basicDetail.permanentCode : this.dsas.basicDetail.temporaryCode
        if (this.dsas.basicDetail.pincode) {
          await this.getCityByPincode(this.dsas.basicDetail.pincode)
        }
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
      this.toasterService.error(this.alertMessage)
    }
  }

  public viewLoanDetail(ele) {
    let name = ele.serviceName.replace(/\s/g, '-')
    let route = name.toLowerCase() + '/view/' + ele.id;
    this.router.navigate([route]);
  }

  public navigateEmployeeDetail(id: number) {
    this.router.navigate(["employee/view", id])
  }

  public navigateCustomerDetail(id: number) {
    this.router.navigate(["customer/view", id])
  }

  public navigateGroupDetail(element) {
    if (element.roleName == "SUBDSA")
      this.router.navigate(["subdsa/view", element.id]);
    if (element.roleName == "CONNECTOR")
      this.router.navigate(["connector/view", element.id]);
  }

  public async getCityByPincode(n, type?: string) {
    try {
      this.spinnerService.show();
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        let cities = res.recordList;
        if (cities && cities.length > 0) {
          if (this.dsas.basicDetail.workAddressCityId) {
            this.dsas.basicDetail.workAddressCity = cities.find(c => c.id == this.dsas.basicDetail.workAddressCityId).name
          }
        }

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
      this.toasterService.error(error)
    }
  }

}
