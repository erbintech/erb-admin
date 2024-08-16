import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BusinessNature } from 'src/app/shared/models/business-nature';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BusinessNatureService } from 'src/app/shared/services/business-nature.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';


declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-business-nature',
  templateUrl: './business-nature.component.html',
  styleUrls: ['./business-nature.component.scss']
})
export class BusinessNatureComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private isShowParentSelection: boolean = true;
  private selectedBusinessNature = [];
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;

  public user: Users = new Users();
  public title: string;
  public displayColumns = ["id","name", "Status", "Action"];
  public businessNatures: BusinessNature[] = new Array<BusinessNature>();
  public businessNature:any = new BusinessNature();
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
    private businessNatureService: BusinessNatureService,
    private modalService: NgbModal
  ) { 
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'businessNature');
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

  businessNatureform = new FormGroup({
    'name': new FormControl('', Validators.required),
  });

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getBusinessNature();
    }
  }

  public async getBusinessNature() {
    try {
      this.spinnerService.show();
      let res = await this.businessNatureService.getBusinessNature(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.businessNatures = res.recordList;

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

  public async insertBusinessNature() {
    try {
      if (this.businessNatureform.valid) {
        this.spinnerService.show();
        if (this.businessNature.id) {
          let id = this.businessNature.id;
          this.businessNature = this.businessNatureform.value;
          this.businessNature.id = id;
          let res = await this.businessNatureService.updateBusinessNature(this.businessNature.id, this.businessNature.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getBusinessNature();
          }
        }
        else {
          this.businessNature = this.businessNatureform.value;
          let res = await this.businessNatureService.insertBusinessNature(this.businessNature.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getBusinessNature();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.businessNatureform.controls).forEach(key => {
          this.businessNatureform.controls[key].markAsTouched();
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

  public changeStatus(businessNature: BusinessNature) {
    let active = businessNature.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Business Nature",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.businessNatureService.activeInactiveBusinessNature(businessNature.id, businessNature.isActive, this.token);
          if (res && res.status == 200) {
            this.getBusinessNature();
            Swal.fire(
              active,
              'Successfully ' + active + ' Business Nature',
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
        businessNature.isActive = !businessNature.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
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
    this.title = "Insert Business Nature";
    this.businessNature = new BusinessNature();
    this.isShowParentSelection = true;
    this.selectedBusinessNature = this.businessNatures;
    this.businessNatureform.reset();
  }

  public editDialog(element: BusinessNature, basicmodal) {
    this.title = "Edit Business Nature"
    this.businessNature = new BusinessNature();
    this.businessNature = element;
    this.businessNatureform.setValue({
      "name": this.businessNature.name
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
    this.selectedBusinessNature = this.businessNatures.filter(c => c.id != element.id);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}