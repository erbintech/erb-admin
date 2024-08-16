import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BankLoanPolicy } from 'src/app/shared/models/bank-loan-policy';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BankLoanPolicyService } from 'src/app/shared/services/bank-loan-policy.service';
import { BankService } from 'src/app/shared/services/bank.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

@Component({
  selector: 'app-bank-loan-policy',
  templateUrl: './bank-loan-policy.component.html',
  styleUrls: ['./bank-loan-policy.component.scss']
})
export class BankLoanPolicyComponent implements OnInit {
  public bankLoanPolicies: BankLoanPolicy[] = new Array<BankLoanPolicy>();
  public token: string;
  private alertMessage: string
  public policyColumns = ["id", "serviceName", "employmentType", "companyCategoryType", "minIncome", "vintage", "turnOver", "itrRequired", "loanAmount", "tenure", "ROI", "cibilScore", 'createdDate']
  public displayColumns = ["id", "bankName", "action"];
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  public paginate: any;
  public bankLoanPolicy: any;

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public banks = [];
  public selectedBank: number

  constructor(
    private spinnerService: NgxSpinnerService,
    private bankLoanPolicyService: BankLoanPolicyService,
    private toastrService: ToastrService,
    private router: Router,
    private paginationService: PaginationService,
    private modalService: NgbModal,
    private bankService: BankService,
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'bankLoanPolicy');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isReadPermission = (roleId == 1) ? true : this._userPagePermission[ind].readPermission;
        this.isWritePermission = (roleId == 1) ? true : this._userPagePermission[ind].writePermission;
        this.isEditPermission = (roleId == 1) ? true : this._userPagePermission[ind].editPermission;
        this.isDeletePermission = (roleId == 1) ? true : this._userPagePermission[ind].deletePermission;
      }
    } else {
      let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
      this.isReadPermission = (roleId == 1) ? true : false;
      this.isWritePermission = (roleId == 1) ? true : false;
      this.isEditPermission = (roleId == 1) ? true : false;
      this.isDeletePermission = (roleId == 1) ? true : false;
    }
  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    await this.getBanks();
    await this.setPage(1);
  }

  private async getBanks() {
    try {
      this.spinnerService.show();
      let res = await this.bankService.getBanks(null, null, null, this.token);
      if (res && res.status == 200) {
        this.banks = res.recordList;
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getBankLoanPolicy();
    }
  }

  private async getBankLoanPolicy() {
    try {
      this.spinnerService.show();
      let res = await this.bankLoanPolicyService.getBankLoanPolicy(this.selectedBank, this.token);
      if (res && res.status == 200) {
        this.bankLoanPolicies = res.recordList;
        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public navigateAddPolicy() {
    this.router.navigate(['/bankLoanPolicy/add'])
  }

  public navigateEditLoanPolicy(ele: BankLoanPolicy) {
    this.router.navigate(['/bankLoanPolicy/edit', ele.bankId])
  }

  public viewDetail(element, basicmodal) {
    this.bankLoanPolicy = element;
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public closeDialog() {
    this.bankLoanPolicy = null
    this.modalService.dismissAll();
  }

  public clearSearch() {
    this.selectedBank = null;
    this.setPage(1);
  }
}