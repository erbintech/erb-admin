import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Maritalstatuses } from 'src/app/shared/models/maritalstatuses';
import { MaritalStautusesService } from 'src/app/shared/services/maritalstatus.service';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';


declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-maritalstatuses',
  templateUrl: './maritalstatuses.component.html',
  styleUrls: ['./maritalstatuses.component.scss']
})

export class MaritalstatusesComponent implements OnInit {
  private token: string
  private fetchRecord: number;
  private alertMessage: string;
  private isShowParentSelection: boolean = true;
  private selectedMaritalStatus = [];
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  public maritalStatuses: Maritalstatuses[] = new Array<Maritalstatuses>();
  public maritalStatus:any = new Maritalstatuses();
  public displayColumns = ["status", "isActive", "Action"];
  public user: Users = new Users();
  public title: string;

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private maritalStautusesService: MaritalStautusesService,
    private modalService: NgbModal
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'maritalstatuses');
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
    await this.getMaritalStatuses();
  }

  maritalStatusform = new FormGroup({
    'status': new FormControl('', Validators.required),
  });

  public async getMaritalStatuses() {
    try {
      this.spinnerService.show();
      let res = await this.maritalStautusesService.getMaritalStatuses(this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.maritalStatuses = res.recordList;
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

  public async insertMaritalStatus() {
    try {
      if (this.maritalStatusform.valid) {
        this.spinnerService.show();
        if (this.maritalStatus.id) {
          let id = this.maritalStatus.id;
          this.maritalStatus = this.maritalStatusform.value;
          this.maritalStatus.id = id;
          let res = await this.maritalStautusesService.updateMaritalStatus(this.maritalStatus.id, this.maritalStatus.status, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getMaritalStatuses();
          }
        }
        else {
          this.maritalStatus = this.maritalStatusform.value;
          let res = await this.maritalStautusesService.insertMaritalStatus(this.maritalStatus.status, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getMaritalStatuses();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.maritalStatusform.controls).forEach(key => {
          this.maritalStatusform.controls[key].markAsTouched();
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

  public changeStatus(maritalStatus: Maritalstatuses) {
    let active = maritalStatus.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Marital Status",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.maritalStautusesService.activeInactiveMaritalStatuses(maritalStatus.id, maritalStatus.isActive, this.token);
          if (res && res.status == 200) {
            this.getMaritalStatuses();
            Swal.fire(
              active,
              'Successfully ' + active + ' Marital Status',
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
        maritalStatus.isActive = !maritalStatus.isActive
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
    this.modalService.open(basicmodal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert Marital Status";
    this.maritalStatus = new Maritalstatuses();
    this.isShowParentSelection = true;
    this.selectedMaritalStatus = this.maritalStatuses;
    this.maritalStatusform.reset();
  }

  public editDialog(element: Maritalstatuses, basicmodal) {
    this.title = "Edit Marital Status"
    this.maritalStatus = new Maritalstatuses();
    this.maritalStatus = element;
    this.maritalStatusform.setValue({
      "status": this.maritalStatus.status
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
    this.selectedMaritalStatus = this.maritalStatuses.filter(c => c.id != element.id);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}