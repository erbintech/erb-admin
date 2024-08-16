import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Users } from 'src/app/shared/models/users/user';

import { ResidenceType } from 'src/app/shared/models/residence-type';
import { ResidenceTypeService } from 'src/app/shared/services/residence-type.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { UserPages } from 'src/app/shared/models/users/userPages';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-residence-type',
  templateUrl: './residence-type.component.html',
  styleUrls: ['./residence-type.component.scss']
})
export class ResidenceTypeComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private isShowParentSelection: boolean = true;
  private selectedResidentType = [];
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;

  public user: Users = new Users();
  public title: string;
  public displayColumns = ["id","name", "Status", "Action"];
  public residenceTypes: ResidenceType[] = new Array<ResidenceType>();
  public residenceType:any;
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
    private residenceTypeService: ResidenceTypeService,
    private modalService: NgbModal
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'residencetype');
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

  residenceTypeform = new FormGroup({
    'name': new FormControl('', Validators.required),
  });

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getResidentTypes();
    }
  }

  public async getResidentTypes() {
    try {
      this.spinnerService.show();
      let res = await this.residenceTypeService.getResidentTypes(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.residenceTypes = res.recordList;

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

  public async insertResidentType() {
    try {
      if (this.residenceTypeform.valid) {
        this.spinnerService.show();
        if (this.residenceType.id) {
          let id = this.residenceType.id;
          this.residenceType = this.residenceTypeform.value;
          this.residenceType.id = id;
          let res = await this.residenceTypeService.updateResidentType(this.residenceType.id, this.residenceType.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getResidentTypes();
          }
        }
        else {
          this.residenceType = this.residenceTypeform.value;
          let res = await this.residenceTypeService.insertResidentType(this.residenceType.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getResidentTypes();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.residenceTypeform.controls).forEach(key => {
          this.residenceTypeform.controls[key].markAsTouched();
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

  public changeStatus(residenceType: ResidenceType) {
    let active = residenceType.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Residence Type",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.residenceTypeService.activeInactiveResidentType(residenceType.id, residenceType.isActive, this.token);
          if (res && res.status == 200) {
            this.getResidentTypes();
            Swal.fire(
              active,
              'Successfully ' + active + ' Residence Type',
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
        residenceType.isActive = !residenceType.isActive
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
    this.title = "Insert Residence Type";
    this.residenceType = new ResidenceType();
    this.isShowParentSelection = true;
    this.selectedResidentType = this.residenceTypes;
    this.residenceTypeform.reset();
  }

  public editDialog(element: ResidenceType, basicmodal) {
    
    this.title = "Edit Residence Type"
    this.residenceType = new ResidenceType();
    this.residenceType = element;
    this.residenceTypeform.setValue({
      "name": this.residenceType.name
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
    this.selectedResidentType = this.residenceTypes.filter(c => c.id != element.id);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}