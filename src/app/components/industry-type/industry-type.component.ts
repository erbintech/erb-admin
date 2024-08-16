import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IndustryType } from 'src/app/shared/models/industry-type';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { IndustrytTypeService } from 'src/app/shared/services/industry-type.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-industry-type',
  templateUrl: './industry-type.component.html',
  styleUrls: ['./industry-type.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IndustryTypeComponent implements OnInit {
  private token: string;
  public alertMessage: string;
  public isShowParentSelection: boolean = true;
  public selectedIndustryTypes = [];
  private startIndex: number;
  private fetchRecords: number;
  private skip: number = 0;
  private take: number = 5;
  private activePage: number = 1;
  private count: number = 0;

  public user: Users = new Users();
  public title: string;
  public displayColumns = ["id", "name", "status", "action"];
  public industryTypes: IndustryType[] = new Array<IndustryType>();
  public industryType: any = new IndustryType();
  public paginate: any;
  public isAlert: boolean = false;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public isFlag: boolean = true
  public alertType: string = "danger";


  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private industryTypeService: IndustrytTypeService,
    private modalService: NgbModal
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'industrytype');
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
    await this.getIndustryTypes();
  }

  industryTypeform = new FormGroup({
    'name': new FormControl('', Validators.required),
    'parentId': new FormControl(''),
  });

  public async getIndustryTypes() {
    try {
      this.spinnerService.show();
      let res = await this.industryTypeService.getIndustryTypes(this.token);
      if (res && res.status == 200) {
        this.industryTypes = res.recordList;
        if (this.industryTypes && this.industryTypes.length > 0) {
          this.industryTypes.forEach(ele => {
            let data = this.industryTypes.filter(c => c.parentId == ele.id);
            ele.childIndustryType = data;
          });
          this.industryTypes = this.industryTypes.filter(c => c.parentId == null)
        }
      }
      if (this.industryTypes.length > 0) {
        this.isFlag = true;
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
      this.toastrService.error(this.alertMessage);

    }
  }

  public async insertIndustryType() {
    try {
      if (this.industryTypeform.valid) {
        this.spinnerService.show();
        if (this.industryType.id) {
          let id = this.industryType.id;
          this.industryType = this.industryTypeform.value;
          this.industryType.id = id;
          let res = await this.industryTypeService.updateIndustryType(this.industryType.id, this.industryType.name, this.industryType.parentId, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getIndustryTypes();
          }
        }
        else {
          this.industryType = this.industryTypeform.value;
          let res = await this.industryTypeService.insertIndustryType(this.industryType.name, this.industryType.parentId, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getIndustryTypes();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.industryTypeform.controls).forEach(key => {
          this.industryTypeform.controls[key].markAsTouched();
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

  public changeStatus(industryType: IndustryType) {
    let active = industryType.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Industry Type",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.industryTypeService.activeInactiveIndustryType(industryType.id, industryType.isActive, this.token);
          if (res && res.status == 200) {
            this.getIndustryTypes();
            Swal.fire(
              active,
              'Successfully ' + active + ' Industry Type',
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
        industryType.isActive = !industryType.isActive
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
    this.title = "Insert industry Type";
    this.industryType = new IndustryType();
    this.isShowParentSelection = true;
    this.selectedIndustryTypes = this.industryTypes;
    this.industryTypeform.reset();
  }

  public editDialog(element: IndustryType, basicmodal) {

    this.title = "Edit Industry Type"
    this.industryType = new IndustryType();
    this.industryType = element;
    this.industryTypeform.setValue({
      "name": this.industryType.name,
      "parentId": this.industryType.parentId,
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
    if (element.childIndustryType && element.childIndustryType.length > 0) {
      this.isShowParentSelection = false;
    }
    else {
      this.isShowParentSelection = true;
    }
    this.selectedIndustryTypes = this.industryTypes.filter(c => c.id != element.id);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}