import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BecomePartner } from 'src/app/shared/models/become-partner';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { TrainingService } from 'src/app/shared/services/training.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-become-partner',
  templateUrl: './become-partner.component.html',
  styleUrls: ['./become-partner.component.scss']
})
export class BecomePartnerComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public paginate: any;
  public partnerRequest = [];
  public searchString: string;
  public displayColumns = ['id', 'name', 'contactNo', 'panCardNo', 'aadharCardNo', 'city', 'businessCommitement', 'jobType','requestDate', 'Action']
  public roles = [];
  public requestId: number;
  public customerId: number;
  public assignRoleForm: FormGroup
  public becomePartner: BecomePartner = new BecomePartner();
  public isFlag: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private customerService: CustomerService,
    private modalService: NgbModal,
    private router: Router,
    private trainingService: TrainingService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'becomePartnerRequest');
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
    this.assignRoleForm = formBuilder.group({
      'roleId': [null, [Validators.required]],
      'partnerCode': [null]
    });
  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    await this.getRoles();
    await this.setPage(1);

  }

  public async getRoles() {
    try {
      this.spinnerService.show();
      let res = await this.trainingService.getRoles(this.token);
      if (res && res.status == 200) {
        this.roles = res.recordList;
        if (this.roles && this.roles.length > 0) {
          this.roles = this.roles.filter(c =>  c.name == "DSA" || c.name == "SUBDSA" || c.name == "CONNECTOR" || c.name == "EMPLOYEE")
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getBecomePartnerRequest();
    }
  }

  public async getBecomePartnerRequest() {
    try {
      this.spinnerService.show();
        let res = await this.customerService.getBecomePartnerRequest(this.token, this.searchString, this.startIndex, this.fetchRecord);
        if (res && res.status == 200) {
          this.partnerRequest = res.recordList;
          this.partnerRequest.forEach(ele => {
            ele.isActive = ele.isActive ? true : false
            ele.isDelete = ele.isDelete ? true : false
          })
          this.count = res.totalRecords;
          this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
        }
        if(this.partnerRequest.length > 0){
          this.isFlag = true
        } else {
          this.isFlag = false
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

  public navigateCustomerDetail(ele) {
    this.router.navigate(['/customer/view/', ele.customerId])
  }

  public clearSearch() {
    this.searchString = null;
    this.setPage(1);
  }

  public modalOpen(ele, basicmodal) {
    this.becomePartner = ele;
    this.customerId = ele.customerId;
    this.assignRoleForm.reset();
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
  }

  public async assignRoleToCustomer() {
    if (this.assignRoleForm.valid) {
      if (this.customerId == null) {
        await this.changeStatusbecomePartner();
      } else {
        let roleName = this.roles.find(c => c.id == this.assignRoleForm.get("roleId").value).name
      let customerName = this.becomePartner.fullName
      Swal.fire({
        title: 'Are you sure?',
        text: "You wan't  Assign " + roleName + " to the " + customerName,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, assign it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.spinnerService.show();
            this.becomePartner.roleId = this.assignRoleForm.get("roleId").value;
            this.becomePartner.partnerCode = this.assignRoleForm.get("partnerCode").value ? this.assignRoleForm.get("partnerCode").value : null;
            this.becomePartner.aadharCardNo = this.becomePartner.aadharCardNo ? this.becomePartner.aadharCardNo : null;
            this.becomePartner.addressLine2 = this.becomePartner.addressLine2 ? this.becomePartner.addressLine2 : null;
            this.becomePartner.roleName = roleName;
            let res = await this.customerService.assignRoleToCustomer(this.token, this.becomePartner);
            if (res && res.status == 200) {
              this.modalService.dismissAll();
              this.router.navigate([roleName.toLowerCase()])
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
      })
      const modalContent = document.querySelector('.swal2-container');
      sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
      }
      
    }
    else {
      Object.keys(this.assignRoleForm.controls).forEach(key => {
        this.assignRoleForm.controls[key].markAsTouched();
      });
    }
  }

  public changeStatusbecomePartner() {
    if (this.assignRoleForm.valid) {
      let roleName = this.roles.find(c => c.id == this.assignRoleForm.get("roleId").value).name
      let customerName = this.becomePartner.fullName
      Swal.fire({
        title: 'Are you sure?',
        text: "You wan't  Assign " + roleName + " to the " + customerName,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, assign it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.spinnerService.show();
            this.becomePartner.roleId = this.assignRoleForm.get("roleId").value;
            this.becomePartner.partnerCode = this.assignRoleForm.get("partnerCode").value ? this.assignRoleForm.get("partnerCode").value : null;
            this.becomePartner.aadharCardNo = this.becomePartner.aadharCardNo ? this.becomePartner.aadharCardNo : null;
            this.becomePartner.addressLine2 = this.becomePartner.addressLine2 ? this.becomePartner.addressLine2 : null;
            this.becomePartner.roleName = roleName;
            let res = await this.customerService.becomePartner(this.token, this.becomePartner);
            if (res && res.status == 200) {
              this.router.navigate([roleName.toLowerCase()])
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
      })
      const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
    }
    else {
      Object.keys(this.assignRoleForm.controls).forEach(key => {
        this.assignRoleForm.controls[key].markAsTouched();
      });
    }
  }

  public closeDialog() {
    this.modalService.dismissAll();
    this.assignRoleForm.reset();
    this.becomePartner = null;
  }

}