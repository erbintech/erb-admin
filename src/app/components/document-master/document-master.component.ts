import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DocumentMaster } from 'src/app/shared/models/documentMaster';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { DocumentService } from 'src/app/shared/services/document.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-document-master',
  templateUrl: './document-master.component.html',
  styleUrls: ['./document-master.component.scss']
})
export class DocumentMasterComponent implements OnInit {
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
  public displayColumns = ['id', 'name', 'maxSize', 'status', 'action'];
  public documents: DocumentMaster[] = new Array<DocumentMaster>();
  public document = new DocumentMaster();
  public documentForm: FormGroup;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    private documentService: DocumentService,
    private toastrService: ToastrService
  ) {
    this.documentForm = formBuilder.group({
      'name': [null, [Validators.required]],
      'maxSize': [null, [Validators.required]],
    })
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'documentMaster');
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
      await this.getDocument();
    }
  }


  public async getDocument() {
    try {
      this.spinnerService.show();
      let res = await this.documentService.getDocument(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.documents = res.recordList;
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
    this.title = "Insert Document Master";
    this.document = new DocumentMaster();
  }

  public async insertDocumentMaster(form) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        if (this.document.id) {
          let id = this.document.id;
          this.document = this.documentForm.value;
          this.document.id = id;
          let res = await this.documentService.updateDocument(this.document.id, this.document.name, this.document.maxSize, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getDocument();
          }
        }
        else {
          this.document = this.documentForm.value;
          let res = await this.documentService.insertDocument(this.document.name, this.document.maxSize, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getDocument();
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

  public changeStatus(type: DocumentMaster) {
    let active = type.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Document Master",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.documentService.activeInactiveDocument(type.id, type.isActive, this.token);
          if (res && res.status == 200) {

            Swal.fire(
              active,
              'Successfully ' + active + ' Documnet Master',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
          }
          this.spinnerService.hide();
        } catch (error) {
          this.documents[this.documents.findIndex(c => c.id == type.id)].isActive = !this.documents[this.documents.findIndex(c => c.id == type.id)].isActive
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
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public editDialog(element: DocumentMaster, basicmodal) {
    this.title = "Edit Document Master"
    this.document = new DocumentMaster();
    this.document = element;
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
      "name": this.document.name,
      "maxSize": this.document.maxSize ? this.document.maxSize : null,
    })
  }

  public closeDialog() {
    this.documentForm.reset();
    this.document = new DocumentMaster();
    this.modalService.dismissAll()
  }
}