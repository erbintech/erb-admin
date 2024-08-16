import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EmploymentType } from 'src/app/shared/models/employmentType';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-employment-type',
  templateUrl: './employment-type.component.html',
  styleUrls: ['./employment-type.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EmploymentTypeComponent implements OnInit {
  public token: string
  public employmentTypes: EmploymentType[] = new Array<EmploymentType>();
  public employmentType = new EmploymentType();
  public alertMessage: string;
  public title: string;
  public displayColumns = ['id', 'name', 'status', 'action'];
  public isShowParentSelection: boolean = true;
  public selectedEmploymentType = [];
  public employmentTypeForm: FormGroup;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private employmentTypeService: EmploymentTypeService,
    public toastrService: ToastrService
  ) {
    this.employmentTypeForm = formBuilder.group({
      'name': [null, [Validators.required]],
      'parentId': [null],
    })
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'employmentTypes');
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
    await this.getEmploymentTypes();

  }

  public async getEmploymentTypes() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getEmploymentType(this.token);
      if (res && res.status == 200) {
        this.employmentTypes = res.recordList;
        if (this.employmentTypes && this.employmentTypes.length > 0) {
          this.employmentTypes.forEach(ele => {
            let data = this.employmentTypes.filter(c => c.parentId == ele.id);
            ele.childEmploymentType = data;
          });
          this.employmentTypes = this.employmentTypes.filter(c => c.parentId == undefined)
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

  public modalOpen(basicmodal: any) {
    this.employmentTypeForm.reset();
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
    this.title = "Insert Employment Type";
    this.employmentType = new EmploymentType();
    this.isShowParentSelection = true;
    this.selectedEmploymentType = this.employmentTypes;
  }

  public async insertEmploymentType(form) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        if (this.employmentType.id) {
          let id = this.employmentType.id;
          this.employmentType = this.employmentTypeForm.value;
          this.employmentType.id = id;
          let res = await this.employmentTypeService.updateEmploymentType(this.employmentType.id, this.employmentType.name, this.employmentType.parentId, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getEmploymentTypes();
          }
        }
        else {
          this.employmentType = this.employmentTypeForm.value;
          let res = await this.employmentTypeService.insertEmploymentType(this.employmentType.name, this.employmentType.parentId, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getEmploymentTypes();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
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

  public changeStatus(type: EmploymentType) {
    let active = type.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Employment Type",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.employmentTypeService.activeInactiveEmploymentType(type.id, this.token);
          if (res && res.status == 200) {

            Swal.fire(
              active,
              'Successfully ' + active + ' Employment Type',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
          }
          this.spinnerService.hide();
        } catch (error) {
          this.employmentTypes[this.employmentTypes.findIndex(c => c.id == type.id)].isActive = !this.employmentTypes[this.employmentTypes.findIndex(c => c.id == type.id)].isActive
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
        type.isActive = !type.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public editDialog(element: EmploymentType, basicmodal) {
    this.title = "Edit Employment Type"
    this.employmentType = new EmploymentType();
    this.employmentType = element;
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, {  windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    if (element.childEmploymentType && element.childEmploymentType.length > 0) {
      this.isShowParentSelection = false;
    }
    this.selectedEmploymentType = this.employmentTypes.filter(c => c.id != element.id);
    this.employmentTypeForm.reset();
    this.employmentTypeForm.setValue({
      "name": this.employmentType.name,
      "parentId": this.employmentType.parentId ? this.employmentType.parentId : null
    })
  }

  public addChildEmploymentTypeDialog(element: EmploymentType, basicmodal) {
    this.employmentTypeForm.reset();
    this.title = "Add Sub Employment Type"
    this.employmentType = new EmploymentType();
    this.employmentTypeForm.setValue({
      "name": null,
      "parentId": element.id
    });
    this.isShowParentSelection = false;
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
  }

  public closeDialog() {
    this.modalService.dismissAll();
    this.employmentType = new EmploymentType();

  }
}