import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Services } from 'src/app/shared/models/service';
import { ServiceType } from 'src/app/shared/models/servicetype';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ServicesService } from 'src/app/shared/services/services.service';
import { ServicetypeService } from 'src/app/shared/services/servicetype.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  private isShowParentSelection: boolean = true;
  private selectedServices = [];
  private url: string;
  private startIndex: number;
  private fetchRecord: number;

  public displayColumns = ["id", "Image", "ServiceTypeName", "Name", "ColorCode", "Description", "status", "Action"];
  public services: Services[] = new Array<Services>();
  public service :any;
  public user: Users = new Users();
  public title: string;
  public paginate: any;
  public serviceTypes: ServiceType[] = new Array<ServiceType>();
  public serviceType = new ServiceType();
  public selectedSerciceType = [];
  public isReadonly = true;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private paginationService: PaginationService,
    private toastrService: ToastrService,
    private servicesService: ServicesService,
    private modalService: NgbModal,
    private servicetypeService: ServicetypeService,
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'services');
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
    await this.getServiceType();
    await this.setPage(1);
  }

  servciesform = new FormGroup({
    'name': new FormControl('', Validators.required),
    'serviceTypeId': new FormControl('', Validators.required),
    'displayName': new FormControl('', Validators.required),
    'description': new FormControl(''),
    'iconUrl': new FormControl(null),
    'colorCode': new FormControl('')
  });

  public async getServiceType() {
    try {
      this.spinnerService.show();
      let res = await this.servicetypeService.getServicetype(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.serviceTypes = res.recordList;
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

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getServices();
    }
  }

  public async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.servicesService.getServices(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.services = res.recordList;

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

  public async insertServices() {
    try {
      if (this.servciesform.valid) {
        this.spinnerService.show();
        if (this.service.id) {
          let id = this.service.id;
          this.service = this.servciesform.value;
          this.service.id = id;
          this.service.description = this.service.description ? this.service.description : null;
          this.service.colorCode = this.service.colorCode ? this.service.colorCode : null;
          let res = await this.servicesService.updateServices(this.service.id, this.service.name, this.service.serviceTypeId, this.service.serviceTypeName, this.service.displayName, this.service.description, this.service.iconUrl, this.service.colorCode, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getServices();
          }
        }
        else {
          this.service = this.servciesform.value;
          this.service.description = this.service.description ? this.service.description : null;
          this.service.colorCode = this.service.colorCode ? this.service.colorCode : null;
          let res = await this.servicesService.insertServices(this.service.name, this.service.serviceTypeId, this.service.serviceTypeName, this.service.displayName, this.service.description, this.service.iconUrl, this.service.colorCode, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getServices();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.servciesform.controls).forEach(key => {
          this.servciesform.controls[key].markAsTouched();
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

  public changeStatus(service: Services) {
    let active = service.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't " + active + " this Service Type",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.servicesService.activeInactiveServices(service.id, service.isActive, this.token);
          if (res && res.status == 200) {
            this.getServices();
            Swal.fire(
              active,
              'Successfully ' + active + ' Service Type',
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
        service.isActive = !service.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public editDialog(element: Services, basicmodal) {
    this.title = "Edit Services"
    this.service = new Services();
    this.service = element;
    this.servciesform.setValue({
      "name": this.service.name,
      "serviceTypeId": this.service.serviceTypeId,
      "displayName": this.service.displayName,
      "description": this.service.description ? this.service.description : null,
      "iconUrl": this.service.iconUrl,
      "colorCode": this.service.colorCode
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
    this.selectedServices = this.services.filter(c => c.id != element.id);
  }

  public async selectedImage(e: any) {
    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        this.service.iconUrl = image;
        this.url = image
        this.servciesform.patchValue({
          iconUrl: reader.result
        });
      }
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
    this.title = "Insert Services";
    this.service = new Services();
    this.isShowParentSelection = true;
    this.selectedServices = this.services;
    this.servciesform.reset();
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

  public get color1(): string {
    return this.servciesform.controls['colorCode'].value;
  }
  public set color1(value: string) {
    this.servciesform.controls['colorCode'].setValue(value);
    // let name = ele.serviceName.replace(/\s/g, '-')
  }

  public removeImage() {
    this.service.iconUrl = null;
  }

}