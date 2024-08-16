import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceType } from 'src/app/shared/models/servicetype';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ServicetypeService } from 'src/app/shared/services/servicetype.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-servicetype',
  templateUrl: './servicetype.component.html',
  styleUrls: ['./servicetype.component.scss']
})
export class ServicetypeComponent implements OnInit {
  public token: string
  public isAlert: boolean = false;
  public alertType: string;
  public alertMessage: string;
  public serviceTypes: ServiceType[] = new Array<ServiceType>();
  public serviceType = new ServiceType();
  public rmUsers: Users[] = new Array<Users>();
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public title: string;
  public displayColumns = ["id","Image", "Name", "ColorCode", "Description", "status", "Action"];
  public isShowParentSelection: boolean = true;
  public selectedSerciceType = [];
  public documentType: string;
  public url: string;
  public searchString: string;
  public selectedAssignedUsers = [];
  public user: Users = new Users();
  public startIndex: number;
  public fetchRecord: number;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;


  constructor( 
    private spinnerService: NgxSpinnerService,
    private paginationService: PaginationService,
    public toastrService: ToastrService,
    private servicetypeService: ServicetypeService,
    private modalService: NgbModal
    ) { 
      if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
        this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
        let ind = this._userPagePermission.findIndex(c => c.name == 'serviceType');
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

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getServiceType();
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
    this.title = "Insert Service Type";
    this.serviceType = new ServiceType();
    this.isShowParentSelection = true;
    this.selectedSerciceType = this.serviceTypes;
    this.url = null;
  }

  public async getServiceType() {
    try {
      this.spinnerService.show();
      let res = await this.servicetypeService.getServicetype(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.serviceTypes = res.recordList;

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

  public async insertServiceType(form: NgForm) { 
    try {
      if (form.valid) {
        this.spinnerService.show();
          if (this.serviceType.id) {
            this.serviceType.description = this.serviceType.description ? this.serviceType.description : null;
            this.serviceType.colorCode = this.serviceType.colorCode ? this.serviceType.colorCode : null;
            let res = await this.servicetypeService.updateServicetype(this.serviceType.id, this.serviceType.name, this.serviceType.displayName, this.serviceType.description, this.url, this.serviceType.colorCode, this.token);
            if (res && res.status == 200) {
              this.modalService.dismissAll();
              this.spinnerService.hide();
              await this.getServiceType();
            }
          }
          else{
            this.serviceType.description = this.serviceType.description ? this.serviceType.description : null;
            this.serviceType.colorCode = this.serviceType.colorCode ? this.serviceType.colorCode : null;
            let res = await this.servicetypeService.insertServicetype(this.serviceType.id, this.serviceType.name, this.serviceType.displayName, this.serviceType.description, this.url, this.serviceType.colorCode, this.token);
            if (res && res.status == 200) {
              this.modalService.dismissAll();
              await this.getServiceType();
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

  public changeStatus(service: ServiceType) {
    let active = service.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Service Type",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.servicetypeService.activeInactiveServicetype(service.id, service.isActive, this.token);
          if (res && res.status == 200) {
            this.getServiceType();
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

  public editDialog(element: ServiceType, basicmodal) {
    this.title = "Edit Service Type"
    this.serviceType = new ServiceType();
    this.serviceType = JSON.parse(JSON.stringify(element));
    this.url = this.serviceType.iconUrl ? this.serviceType.iconUrl : null;
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
    this.isShowParentSelection = true;
    this.selectedSerciceType = this.serviceTypes.filter(c => c.id != element.id)
  }

  public cancelUser() {
    this.serviceType = new ServiceType();
    this.selectedSerciceType = [];
    this.modalService.dismissAll();

  }

  public async selectedImage(e: any) {
    
    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        this.url = image
      }
    }
  }

  public removeImage() {
    this.serviceType.iconUrl = null;
  }


}