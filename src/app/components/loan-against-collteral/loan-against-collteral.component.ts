import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoanAgainstCollteral } from 'src/app/shared/models/loan-against-collteral';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { LoanAgainstCollteralService } from 'src/app/shared/services/loan-against-collteral.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-loan-against-collteral',
  templateUrl: './loan-against-collteral.component.html',
  styleUrls: ['./loan-against-collteral.component.scss']
})
export class LoanAgainstCollteralComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  private isShowParentSelection: boolean = true;
  private selectedLoanAgainstCollteral = [];
  private url: string;
  private startIndex: number;
  private fetchRecord: number;

  public user: Users = new Users();
  public title: string;
  public displayColumns = ["id","name", "Status", "Action"];
  public loanAgainstCollterals: LoanAgainstCollteral[] = new Array<LoanAgainstCollteral>();
  public loanAgainstCollteral:any = new LoanAgainstCollteral();
  public paginate: any;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;


  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private loanAgainstCollteralService: LoanAgainstCollteralService,
    private modalService: NgbModal
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'loanagainstcollteral');
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
    await this.setPage(1);
  }

  loanAgainstCollteralform = new FormGroup({
    'name': new FormControl('', Validators.required),
  });

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getLoanAginstCollteral();
    }
  }

  public async getLoanAginstCollteral() {
    try {
      this.spinnerService.show();
      let res = await this.loanAgainstCollteralService.getLoanAginstCollteral(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.loanAgainstCollterals = res.recordList;

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

  public async insertLoanAgainstCollteral() {
    try {
      if (this.loanAgainstCollteralform.valid) {
        this.spinnerService.show();
        if (this.loanAgainstCollteral.id) {
          let id = this.loanAgainstCollteral.id;
          this.loanAgainstCollteral = this.loanAgainstCollteralform.value;
          this.loanAgainstCollteral.id = id;
          let res = await this.loanAgainstCollteralService.updateLoanAgainstCollteral(this.loanAgainstCollteral.id, this.loanAgainstCollteral.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getLoanAginstCollteral();
          }
        }
        else {
          this.loanAgainstCollteral = this.loanAgainstCollteralform.value;
          let res = await this.loanAgainstCollteralService.insertLoanAgainstCollteral(this.loanAgainstCollteral.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getLoanAginstCollteral();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.loanAgainstCollteralform.controls).forEach(key => {
          this.loanAgainstCollteralform.controls[key].markAsTouched();
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

  public changeStatus(loanAgainstCollteral: LoanAgainstCollteral) {
    let active = loanAgainstCollteral.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Loan Against Collteral",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.loanAgainstCollteralService.activeInactiveLoanAgainstCollteral(loanAgainstCollteral.id, loanAgainstCollteral.isActive, this.token);
          if (res && res.status == 200) {
            this.getLoanAginstCollteral();
            Swal.fire(
              active,
              'Successfully ' + active + ' Loan Against Collteral',
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
        loanAgainstCollteral.isActive = !loanAgainstCollteral.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public modalOpen(basicmodal: any) {
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert Loan Against Collateral";
    this.loanAgainstCollteral = new LoanAgainstCollteral();
    this.isShowParentSelection = true;
    this.selectedLoanAgainstCollteral = this.loanAgainstCollterals;
    this.loanAgainstCollteralform.reset();
  }

  public editDialog(element: LoanAgainstCollteral, basicmodal) {
    this.title = "Edit Loan Against Collateral"
    this.loanAgainstCollteral = new LoanAgainstCollteral();
    this.loanAgainstCollteral = element;
    this.loanAgainstCollteralform.setValue({
      "name": this.loanAgainstCollteral.name
    })
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.selectedLoanAgainstCollteral = this.loanAgainstCollterals.filter(c => c.id != element.id);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}