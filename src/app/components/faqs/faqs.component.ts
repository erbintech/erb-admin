import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Faqs } from 'src/app/shared/models/faqs';
import { Users } from 'src/app/shared/models/users/user';
import { FaqsService } from 'src/app/shared/services/faqs.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute } from '@angular/router';
import { UserPages } from 'src/app/shared/models/users/userPages';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  private token: string
  public faqs: Faqs[] = new Array<Faqs>();
  public faq: any = new Faqs();
  public faqCategories = [];
  public faqCategorie: any = new Faqs();
  public faqTypes: Faqs[] = new Array<Faqs>();
  public faqType = new Faqs();
  public title: string;
  public selectedFaqs = [];
  private isShowParentSelection: boolean = true;
  private alertMessage: string;
  private startIndex: number;
  private startIndexFaqs: number;
  private fetchRecord: number;
  private fetchRecordFaqs: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  public paginate: any;
  public user: Users = new Users();
  public paramid: any;
  public faqPaginate: any = {};
  private faqActivePage: number
  private expandedIndex: number
  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  public faqCategoryId: number = 0;

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private faqsService: FaqsService,
    private paginationService: PaginationService,
    private actRoute: ActivatedRoute,
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'faqs');
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
    await this.setPagefaqs(1)
    await this.getFaqs();
    await this.getFaqType();
  }

  faqCategoriesform = new FormGroup({
    'categoryName': new FormControl('', Validators.required),
  })

  faqform = new FormGroup({
    'question': new FormControl('', Validators.required),
    'answer': new FormControl('', Validators.required),
  })

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getFaqCategories();
    }
  }

  public async setPagefaqs(pageNumber: number) {
    if (pageNumber > 0) {
      this.faqActivePage = pageNumber;
      this.startIndexFaqs = (this.take * (this.faqActivePage - 1));
      this.fetchRecordFaqs = this.take;
      this.skip = this.startIndexFaqs;
      await this.getFaqCategories();
    }
  }

  public async getFaqCategories() {
    try {
      this.spinnerService.show();
      let res = await this.faqsService.getFaqCategories(this.startIndex, this.fetchRecord, this.startIndexFaqs, this.fetchRecordFaqs, this.token);
      if (res && res.status == 200) {
        this.faqCategories = res.recordList;
        if (this.faqCategories && this.faqCategories.length > 0) {
          for (let index = 0; index < this.faqCategories.length; index++) {
            if (this.faqCategories[index].faqs && this.faqCategories[index].faqs.length > 0) {
              for (let j = 0; j < this.faqCategories[index].faqs.length; j++) {
                this.faqCategories[index].faqs[j].isActive = this.faqCategories[index].faqs[j].isActive ? true : false;
              }
              let faqCount = this.faqCategories[index].faqTotalRecord
              this.faqPaginate = this.paginationService.getPager(faqCount, +this.faqActivePage, this.take);
              this.faqCategories[index].faqPaginate = this.faqPaginate
              if (index == this.expandedIndex)
                this.faqCategories[index].expanded = true
            }
            this.faqCategories[index].isActive = this.faqCategories[index].isActive ? true : false;
          }
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public async getFaqs() {
    try {
      this.spinnerService.show();
      this.faq.faqCategoryId = this.faqCategoryId;
      let res = await this.faqsService.getFaqs(this.faq.faqCategoryId, this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.faqs = res.recordList;


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

  public async getFaqType() {
    try {
      this.spinnerService.show();
      let res = await this.faqsService.getFaqType(this.token);
      if (res && res.status == 200) {
        this.faqTypes = res.recordList;
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

  public async insertUpdateFaqCategories() {
    try {
      if (this.faqCategoriesform.valid) {
        this.spinnerService.show();
        let categoryId = this.faqCategorie.id;
        this.faqCategorie = this.faqCategoriesform.value;
        this.faqCategorie.categoryId = categoryId;
        let category = this.faqCategorie.categoryId ? this.faqCategorie.categoryId : 0;
        this.faqCategorie.categoryId = category;
        let res = await this.faqsService.insertUpdateFaqCategories(this.faqCategorie.categoryId, this.faqCategorie.categoryName, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.spinnerService.hide();
          await this.getFaqs();
          await this.getFaqCategories();
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.faqCategoriesform.controls).forEach(key => {
          this.faqCategoriesform.controls[key].markAsTouched();
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

  public async insertUpdateFaqs() {
    try {
      if (this.faqform.valid) {
        this.spinnerService.show();
        let id = this.faq.id;
        this.faq = this.faqform.value;
        this.faq.id = id;
        let coin = this.faq.id ? this.faq.id : 0;
        this.faq.id = coin;
        this.faq.faqCategoryId = this.faqCategoryId;
        this.faq.faqType = this.faqType.id;
        let res = await this.faqsService.insertUpdateFaqs(this.faq.id, this.faq.faqType, this.faq.faqCategoryId, this.faq.question, this.faq.answer, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.spinnerService.hide();
          await this.getFaqs();
          await this.getFaqCategories();

        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.faqform.controls).forEach(key => {
          this.faqform.controls[key].markAsTouched();
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

  public async modalOpen(basicmodal: any) {
    this.faqCategoriesform.reset();
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert FAQ Category";
    this.faq = new Faqs();
    this.isShowParentSelection = true;
    this.selectedFaqs = this.faqs;
  }

  public async editDialog(basicmodal: any, faqCategorie) {
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Edit FAQ Category"
    this.faqCategorie = new Faqs();
    this.faqCategorie = faqCategorie;
    this.faqCategoriesform.setValue({
      "categoryName": this.faqCategorie.categoryName
    })
    this.selectedFaqs = this.faqCategories.filter(c => c.categoryId != faqCategorie.categoryId);
  }

  public async addfaq(faqmodal: any, categoryId: number, type: number) {
    this.faqform.reset();
    // this.modalService.open(faqmodal, { size: 'xl' });
    this.modalService.open(faqmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert FAQ";
    this.faq = new Faqs();
    this.faqCategoryId = categoryId;
    this.faqType.id = type;
    this.isShowParentSelection = true;
    this.selectedFaqs = this.faqs;
  }

  public async editFaq(faqmodal: any, faq, categoryId: number, type: number) {
    // this.modalService.open(faqmodal, { size: 'xl' });
    this.modalService.open(faqmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Edit FAQ"
    this.faq = new Faqs();
    this.faq = faq;
    this.faqCategoryId = categoryId;
    this.faqType.id = type;
    this.faqform.setValue({
      "question": this.faq.question,
      "answer": this.faq.answer
    })
    this.selectedFaqs = this.faqCategories.filter(c => c.id != faq.id);

  }

  public changeStatus(faq) {
    let active = faq.isActive ? "InActive" : "Active"
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
          let res = await this.faqsService.activeInactiveFaqs(faq.id, faq.isActive, this.token);
          if (res && res.status == 200) {
            await this.getFaqs();
            await this.getFaqCategories();
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
        faq.isActive = !faq.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public changeStatusCategory(faqCategorie) {
    let active = faqCategorie.isActive ? "InActive" : "Active"
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
          let res = await this.faqsService.activeInactiveFaqsCategories(faqCategorie.id, !faqCategorie.isActive, this.token);
          if (res && res.status == 200) {
            await this.getFaqs();
            await this.getFaqCategories();
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
        faqCategorie.isActive = !faqCategorie.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}