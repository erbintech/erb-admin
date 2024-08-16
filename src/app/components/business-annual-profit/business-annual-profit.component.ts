import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BusinessAnnualProfit } from 'src/app/shared/models/business-annual-profit';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BusinessAnnualProfitService } from 'src/app/shared/services/business-annual-profit.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-business-annual-profit',
  templateUrl: './business-annual-profit.component.html',
  styleUrls: ['./business-annual-profit.component.scss']
})
export class BusinessAnnualProfitComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private isShowParentSelection: boolean = true;
  private selectedBusinessAnnualProfit = [];
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;

  public user: Users = new Users();
  public title: string;
  public displayColumns = ["id","name", "Status", "Action"];
  public businessAnnualProfits: BusinessAnnualProfit[] = new Array<BusinessAnnualProfit>();
  public businessAnnualProfit:any = new BusinessAnnualProfit();
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
    private businessAnnualProfitService: BusinessAnnualProfitService,
    private modalService: NgbModal
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'businessannualprofit');
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

  businessAnnualProfitform = new FormGroup({
    'name': new FormControl('', Validators.required),
  });

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getBusinessAnnualProfits();
    }
  }

  public async getBusinessAnnualProfits() {
    try {
      this.spinnerService.show();
      let res = await this.businessAnnualProfitService.getBusinessAnnualProfits(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.businessAnnualProfits = res.recordList;

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

  public async insertBusinessAnnualProfits() {
    try {
      if (this.businessAnnualProfitform.valid) {
        this.spinnerService.show();
        if (this.businessAnnualProfit.id) {
          let id = this.businessAnnualProfit.id;
          this.businessAnnualProfit = this.businessAnnualProfitform.value;
          this.businessAnnualProfit.id = id;
          let res = await this.businessAnnualProfitService.updateBusinessAnnualProfit(this.businessAnnualProfit.id, this.businessAnnualProfit.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getBusinessAnnualProfits();
          }
        }
        else {
          this.businessAnnualProfit = this.businessAnnualProfitform.value;
          let res = await this.businessAnnualProfitService.insertBusinessAnnualProfit(this.businessAnnualProfit.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getBusinessAnnualProfits();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.businessAnnualProfitform.controls).forEach(key => {
          this.businessAnnualProfitform.controls[key].markAsTouched();
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

  public changeStatus(businessAnnualProfit: BusinessAnnualProfit) {
    let active = businessAnnualProfit.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Business Annual Profit",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.businessAnnualProfitService.activeInactiveBusinessAnnualProfit(businessAnnualProfit.id, businessAnnualProfit.isActive, this.token);
          if (res && res.status == 200) {
            this.getBusinessAnnualProfits();
            Swal.fire(
              active,
              'Successfully ' + active + ' Business Annual Profit',
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
        businessAnnualProfit.isActive = !businessAnnualProfit.isActive
      }
    })
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.remove('dark-only-modal')
    }
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
    this.title = "Insert Business Annual Profit";
    this.businessAnnualProfit = new BusinessAnnualProfit();
    this.isShowParentSelection = true;
    this.selectedBusinessAnnualProfit = this.businessAnnualProfits;
    this.businessAnnualProfitform.reset();
  }

  public editDialog(element: BusinessAnnualProfit, basicmodal) {
    this.title = "Edit Business Annual Profit"
    this.businessAnnualProfit = new BusinessAnnualProfit();
    this.businessAnnualProfit = element;
    this.businessAnnualProfitform.setValue({
      "name": this.businessAnnualProfit.name
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
    this.selectedBusinessAnnualProfit = this.businessAnnualProfits.filter(c => c.id != element.id);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}