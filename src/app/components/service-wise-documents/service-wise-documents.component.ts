import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceDocument } from 'src/app/shared/models/serviceDocument';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { DocumentService } from 'src/app/shared/services/document.service';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-service-wise-documents',
  templateUrl: './service-wise-documents.component.html',
  styleUrls: ['./service-wise-documents.component.scss']
})
export class ServiceWiseDocumentsComponent implements OnInit {

  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public title: string
  public alertMessage: string;
  public token: string;
  public displayColumns = ['id', 'serviceName', 'document', 'displayName', 'noOfDocument', 'employmentType', 'required', 'newTransfer','status', 'action'];
  public serviceDocuments: ServiceDocument[] = new Array<ServiceDocument>();
  public serviceDocument = new ServiceDocument();
  public documents: Document[] = new Array<Document>();
  public services = [];
  public documentForm: FormGroup;
  public selectedServiceId = new FormControl();
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public employmentTypes = []

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    private documentService: DocumentService,
    private toastrService: ToastrService,
    private employmentTypeService: EmploymentTypeService,
  ) {
    this.documentForm = formBuilder.group({
      'serviceId': [null, [Validators.required]],
      'documentId': [null, [Validators.required]],
      'displayName': [null, [Validators.required]],
      'documentCount': [null, [Validators.required]],
      'isPdf': [null],
      'isRequired': [null],
      'employmentTypeId': [null, [Validators.required]],
      'requiredForNew': [null, [Validators.required]],
      'requiredForTransfer': [null, [Validators.required]],

    })
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'serviceDocument');
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
    this.getDocument();
    this.getServices();
    await this.getEmploymentTypes()
    this.documentForm.get("requiredForNew").setValue(true)
    this.documentForm.get("requiredForTransfer").setValue(true)
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getServiceDocument();
    }
  }

  public async getEmploymentTypes() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getEmploymentType(this.token);
      if (res && res.status == 200) {
        this.employmentTypes = res.recordList;
        this.employmentTypes = this.employmentTypes.filter(c => c.isParent != true);
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

  public async getDocument() {
    try {
      this.spinnerService.show();
      let res = await this.documentService.getDocument(null, null, this.token);
      if (res && res.status == 200) {
        this.documents = res.recordList;
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

  public async getServiceDocument() {
    try {
      this.spinnerService.show();
      let selectedServiceId = this.selectedServiceId.value ? this.selectedServiceId.value : null;
      let res = await this.documentService.getServiceDocument(this.startIndex, this.fetchRecord, selectedServiceId, this.token);
      if (res && res.status == 200) {
        this.serviceDocuments = res.recordList;
        if (this.serviceDocuments && this.serviceDocuments.length > 0) {
          this.serviceDocuments.forEach(ele => {
            ele.isRequiredForNew = ele.isRequiredForNew ? true : false;
            ele.isRequiredForTransfer = ele.isRequiredForTransfer ? true : false;
          })
        }
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
      this.toastrService.error(this.alertMessage);
    }
  }


  public modalOpen(basicmodal: any) {
    this.documentForm.reset();
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
    this.title = "Insert Service Document";
    this.serviceDocument = new ServiceDocument();
    this.documentForm.get("requiredForNew").setValue('Yes')
    this.documentForm.get("requiredForTransfer").setValue('Yes')
  }

  public async insertServiceDocument(form) {
    try {
      if (form.valid) {
        this.spinnerService.show();

        if (this.serviceDocument.id) {
          let id = this.serviceDocument.id;
          this.serviceDocument = this.documentForm.value;
          this.serviceDocument.id = id;
          this.serviceDocument.isRequired = this.serviceDocument.isRequired ? true : false
          this.serviceDocument.isPdf = this.serviceDocument.isPdf ? true : false
          this.serviceDocument.isRequiredForNew = this.documentForm.get("requiredForNew").value == 'Yes' ? true : false
          this.serviceDocument.isRequiredForTransfer = this.documentForm.get("requiredForTransfer").value == 'Yes' ? true : false
          let res = await this.documentService.updateServiceDocument(this.serviceDocument, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getServiceDocument();
          }
        }
        else {
          this.serviceDocument = this.documentForm.value;
          this.serviceDocument.isRequired = this.serviceDocument.isRequired ? true : false
          this.serviceDocument.isPdf = this.serviceDocument.isPdf ? true : false
          this.serviceDocument.isRequiredForNew = this.documentForm.get("requiredForNew").value == 'Yes' ? true : false
          this.serviceDocument.isRequiredForTransfer = this.documentForm.get("requiredForTransfer").value == 'Yes' ? true : false
          let res = await this.documentService.insertServiceDocument(this.serviceDocument, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getServiceDocument();
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

  public changeStatus(type: ServiceDocument) {
    let active = type.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Service Document",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.documentService.activeIanctiveServiceDocument(type.id, type.isActive, this.token);
          if (res && res.status == 200) {

            Swal.fire(
              active,
              'Successfully ' + active + ' Service Document',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
          }
          this.spinnerService.hide();
        } catch (error) {
          this.serviceDocuments[this.serviceDocuments.findIndex(c => c.id == type.id)].isActive = !this.serviceDocuments[this.serviceDocuments.findIndex(c => c.id == type.id)].isActive
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

  public editDialog(element: ServiceDocument, basicmodal) {
    this.title = "Edit Service Document"
    this.serviceDocument = new ServiceDocument();
    this.serviceDocument = element;
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
    this.documentForm.reset();
    this.documentForm.setValue({
      "serviceId": this.serviceDocument.serviceId,
      "documentId": this.serviceDocument.documentId,
      "displayName": this.serviceDocument.displayName,
      "documentCount": this.serviceDocument.documentCount,
      "isRequired": this.serviceDocument.isRequired,
      "isPdf": this.serviceDocument.isPdf,
      "employmentTypeId": this.serviceDocument.employmentTypeId ? this.serviceDocument.employmentTypeId : null,
      "requiredForTransfer": this.serviceDocument.isRequiredForTransfer ? 'Yes' : 'No',
      "requiredForNew": this.serviceDocument.isRequiredForNew ? 'Yes' : 'No',
    })
  }

  public closeDialog() {
    this.documentForm.reset();
    this.serviceDocument = new ServiceDocument();
    this.modalService.dismissAll()
  }

  public clearSearch() {
    this.selectedServiceId = new FormControl();
    this.getServiceDocument();
  }
}