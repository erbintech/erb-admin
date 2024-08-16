import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/shared/models/bank';
import { BankLoan } from 'src/app/shared/models/bank-loan';
import { Services } from 'src/app/shared/models/service';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BankLoanService } from 'src/app/shared/services/bank-loan.service';
import { BankService } from 'src/app/shared/services/bank.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ServicesService } from 'src/app/shared/services/services.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-bank-loan',
  templateUrl: './bank-loan.component.html',
  styleUrls: ['./bank-loan.component.scss']
})
export class BankLoanComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private isShowParentSelection: boolean = true;
  public selectedBankLoan = [];
  public selectedService = [];
  public selectedBank = [];
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;

  public user: Users = new Users();
  public title: string;
  public displayColumns = ["id", "loanName", "bankId", "serviceId", "status", "createdDate", "action"];
  public bankLoans: BankLoan[] = new Array<BankLoan>();
  public bankLoan:any = new BankLoan();
  public paginate: any;
  public searchString: string;
  public banks: Bank[] = new Array<Bank>();
  public bank = new Bank();
  public services: Services[] = new Array<Services>();
  public service = new Services();
  public isRequired: boolean = true;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private bankLoanService: BankLoanService,
    private bankservice: BankService,
    private serviceService: ServicesService,
    private modalService: NgbModal
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'bankLoan');
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
    await this.getServices();
    await this.setPage(1);
  }

  bankLoanform = new FormGroup({
    'bankId': new FormControl('', Validators.required),
    "serviceId": new FormControl(null, Validators.required),
    "loanName": new FormControl(null, Validators.required),
  });

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getBankLoans();
    }
  }

  public async getBanks() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.bankservice.getBanks(null, null, searchString, this.token);
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

  public async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.serviceService.getServices(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.services = res.recordList;
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

  public async getBankLoans() {
    try {
      this.spinnerService.show();
      let serviceIds = this.selectedService ? this.selectedService : [];
      let bankIds = this.selectedBank ? this.selectedBank : [];
      let res = await this.bankLoanService.getBankLoans(this.startIndex, this.fetchRecord, bankIds, serviceIds, this.token);
      if (res && res.status == 200) {
        this.bankLoans = res.recordList;

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

  public async insertBankLoan() {
    try {
      if (this.bankLoanform.valid) {
        this.spinnerService.show();
        if (this.bankLoan.id) {
          let id = this.bankLoan.id;
          this.bankLoan = this.bankLoanform.value;
          this.bankLoan.id = id;
          let res = await this.bankLoanService.updateBankLoan(this.bankLoan.id, this.bankLoan.loanName, this.bankLoan.bankId, this.bankLoan.serviceId, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getBankLoans();
          }
        }
        else {
          this.bankLoan = this.bankLoanform.value;
          let res = await this.bankLoanService.insertBankLoan(this.bankLoan.loanName, this.bankLoan.bankId, this.bankLoan.serviceId, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getBankLoans();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.bankLoanform.controls).forEach(key => {
          this.bankLoanform.controls[key].markAsTouched();
        });
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public changeStatus(bankLoan: BankLoan) {
    let active = bankLoan.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Bank Loan",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.bankLoanService.activeInactiveBankLoan(bankLoan.id, bankLoan.isActive, this.token);
          if (res && res.status == 200) {
            this.getBankLoans();
            Swal.fire(
              active,
              'Successfully ' + active + ' Bank Loan',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
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
      else {
        bankLoan.isActive = !bankLoan.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public clearSearch() {
    this.selectedService = null
    this.selectedBank = null;
    this.setPage(1);
  }

  public modalOpen(basicmodal: any) {
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, {windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert Bank Loan";
    this.bankLoan = new BankLoan();
    this.isShowParentSelection = true;
    this.selectedBankLoan = this.bankLoans;
    this.bankLoanform.reset();
  }

  public editDialog(element: BankLoan, basicmodal) {
    this.title = "Edit Bank Loan"
    this.bankLoan = new BankLoan();
    this.bankLoan = element;
    this.bankLoanform.setValue({
      "loanName": this.bankLoan.loanName,
      "bankId": this.bankLoan.bankId,
      "serviceId": this.bankLoan.serviceId,
    })
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, {windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.selectedBankLoan = this.bankLoans.filter(c => c.id != element.id);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}