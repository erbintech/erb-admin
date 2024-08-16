import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EmploymentType } from 'src/app/shared/models/employmentType';
import { ServiceEmploymentType } from 'src/app/shared/models/serviceEmploymentType';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';

@Component({
  selector: 'app-service-employment-type',
  templateUrl: './service-employment-type.component.html',
  styleUrls: ['./service-employment-type.component.scss']
})
export class ServiceEmploymentTypeComponent implements OnInit {
  public token: string
  public employmentTypes: EmploymentType[] = new Array<EmploymentType>();
  public serviceEmploymentTypes: ServiceEmploymentType[] = new Array<ServiceEmploymentType>();
  public serviceEmploymentType = new ServiceEmploymentType();
  public alertMessage: string;
  public title: string;
  public displayColumns = ['id', 'serviceName', 'action'];
  public childDisplayColumns = ['id', 'typeName'];
  public isShowParentSelection: boolean = true;
  public selectedEmploymentType = [];
  public employmentTypeForm: FormGroup;
  public services = [];
  public serviceId: number;
  public isSelectAll: boolean = false;
  public isView: boolean
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
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'serviceEmploymentTypes');
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
    this.getEmploymentTypes();
    this.getServices();
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

  public async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getServices(this.token);
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public async insertServiceEmploymetType() {
    try {
      this.spinnerService.show();
      this.selectedEmploymentType = [];
      for (let index = 0; index < this.employmentTypes.length; index++) {
        if (this.employmentTypes[index].childEmploymentType && this.employmentTypes[index].childEmploymentType.length > 0) {
          this.employmentTypes[index].childEmploymentType.forEach(ele => {
            if (ele.isSelected)
              this.selectedEmploymentType.push(ele.id);
          })
        }
        else {
          if (this.employmentTypes[index].isSelected)
            this.selectedEmploymentType.push(this.employmentTypes[index].id);
        }
      }
      if (this.selectedEmploymentType && this.selectedEmploymentType.length == 0) {
        this.toastrService.warning("Please Select EmploymentType")
      }
      else {
        let res = await this.employmentTypeService.insertServiceEmploymentType(this.serviceId, this.selectedEmploymentType, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.serviceId = null;
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



  public async modalOpen(element: any, basicmodal, isView) {
    try {
      this.spinnerService.show();
      this.serviceId = element.id;
      this.isSelectAll = false;
      if (this.employmentTypes && this.employmentTypes.length > 0) {
        this.employmentTypes.forEach(ele => {
          ele.isSelected = false;
          if (ele.childEmploymentType && ele.childEmploymentType.length > 0) {
            ele.childEmploymentType.forEach(childele => {
              childele.isSelected = false;
            })
          }
        })
      }
      let res = await this.employmentTypeService.getServiceEmploymentType(this.token, element.id);
      if (res && res.status == 200) {
        this.serviceEmploymentTypes = res.recordList;
        if (this.serviceEmploymentTypes && this.serviceEmploymentTypes.length > 0) {
          if (this.employmentTypes && this.employmentTypes.length > 0) {
            for (let i = 0; i < this.serviceEmploymentTypes.length; i++) {
              let index = this.employmentTypes.findIndex(c => c.id == this.serviceEmploymentTypes[i].employmentTypeId);
              if (index >= 0) {
                this.employmentTypes[index].isSelected = true;
              }
              else {
                this.employmentTypes.forEach(ele => {
                  if (ele.childEmploymentType && ele.childEmploymentType.length > 0) {
                    let ind = ele.childEmploymentType.findIndex(c => c.id == this.serviceEmploymentTypes[i].employmentTypeId);
                    if (ind >= 0) {
                      ele.childEmploymentType[ind].isSelected = true;
                    }
                    let childind = ele.childEmploymentType.findIndex(c => c.isSelected == false);
                    if (childind >= 0)
                      ele.isSelected = false
                    else
                      ele.isSelected = true;
                  }
                })
              }
            }
            this.employmentTypes.forEach(ele => {
              if (!ele.isSelected)
                ele.isSelected = false
            })
            let selectedEmp = this.employmentTypes.findIndex(c => c.isSelected == false)
            if (selectedEmp < 0) {
              this.isSelectAll = true;
            }
          }

        }
        if (isView) {
          this.isView = true;
          this.title = "View EmpoymentType"
        } else {
          this.isView = false;
          this.title = "Add EmpoymentType"
        }
        // this.modalService.open(basicmodal)
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

  public selectEmploymentType(id: number) {
    let index = this.employmentTypes.findIndex(c => c.id == id);
    if (index >= 0) {
      this.employmentTypes[index].isSelected = !this.employmentTypes[index].isSelected;
      if (!this.employmentTypes[index].isSelected) {
        this.isSelectAll = false;
      }
      if (this.employmentTypes[index].childEmploymentType && this.employmentTypes[index].childEmploymentType.length > 0) {
        this.employmentTypes[index].childEmploymentType.forEach(ele => {
          if (this.employmentTypes[index].isSelected) {
            ele.isSelected = true;
          }
          else {
            ele.isSelected = false;
            this.isSelectAll = false;
          }
        })
      }
    }
    else {
      this.employmentTypes.forEach(ele => {
        if (ele.childEmploymentType && ele.childEmploymentType.length > 0) {
          let ind = ele.childEmploymentType.findIndex(c => c.id == id);
          if (ind >= 0) {
            ele.childEmploymentType[ind].isSelected = !ele.childEmploymentType[ind].isSelected;
            if (!ele.childEmploymentType[ind].isSelected)
              ele.isSelected = false;
            this.isSelectAll = false;
          }
        }
      })
    }
    let selectedEmp = this.employmentTypes.findIndex(c => c.isSelected == false)
    if (selectedEmp < 0) {
      this.isSelectAll = true;
    }
  }

  public selectAll() {
    this.isSelectAll = !this.isSelectAll
    this.employmentTypes.forEach(ele => {
      ele.isSelected = this.isSelectAll;
      if (ele.childEmploymentType && ele.childEmploymentType.length > 0) {
        ele.childEmploymentType.forEach(childele => {
          childele.isSelected = this.isSelectAll
        })
      }
    })
  }

  public closeDialog() {
    this.selectedEmploymentType = [];
    this.serviceId = null;
    this.isSelectAll = false;
    this.modalService.dismissAll();
    this.serviceEmploymentTypes = [];
  }
}