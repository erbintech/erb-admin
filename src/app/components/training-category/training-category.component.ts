import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TrainingCategory } from 'src/app/shared/models/trainingCategory';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { TrainingService } from 'src/app/shared/services/training.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-training-category',
  templateUrl: './training-category.component.html',
  styleUrls: ['./training-category.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TrainingCategoryComponent implements OnInit {
  public token: string
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public trainingCategories: TrainingCategory[] = new Array<TrainingCategory>();
  public trainingCategory = new TrainingCategory();
  public alertMessage: string;
  public isAlert: boolean = false;
  public alertType: string;
  public title: string;
  public displayColumns = ['id', 'name', 'status', 'createdDate', 'action'];
  public isShowParentSelection: boolean = true;
  public selectedTrainingCategories = [];
  public user: Users = new Users();

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    private router: Router,
    private trainingService: TrainingService,
    public toastrService: ToastrService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'trainingCategories');
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
    await this.getTrainigCategory();
  }



  public async getTrainigCategory() {
    try {
      this.spinnerService.show();
      let res = await this.trainingService.getTrainingCategory(this.token);
      if (res && res.status == 200) {
        this.trainingCategories = res.recordList;
        if (this.trainingCategories && this.trainingCategories.length > 0) {
          this.trainingCategories.forEach(ele => {
            let data = this.trainingCategories.filter(c => c.parentId == ele.id);
            ele.childTrainingCategory = data;
          });
          this.trainingCategories = this.trainingCategories.filter(c => c.parentId == undefined)
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
    this.title = "Insert Training Categroy";
    this.trainingCategory = new TrainingCategory();
    this.isShowParentSelection = true;
    this.selectedTrainingCategories = this.trainingCategories;
  }

  public async insertTrainingCategory(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        if (this.trainingCategory.id) {
          let res = await this.trainingService.updateTrainingCategory(this.trainingCategory.id, this.trainingCategory.name, this.trainingCategory.parentId, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getTrainigCategory();
          }
        }
        else {

          let res = await this.trainingService.insertTrainingCategory(this.trainingCategory.name, this.trainingCategory.parentId, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getTrainigCategory();
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

  public changeStatus(categrory: TrainingCategory) {
    let active = categrory.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Training Category",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.trainingService.activeInactiveTrainingCategory(categrory.id, this.token);
          if (res && res.status == 200) {
            this.getTrainigCategory();
            Swal.fire(
              active,
              'Successfully ' + active + ' Training Categroy',
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
        categrory.isActive = !categrory.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public warningAlert(categrory: TrainingCategory) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Delete this Training Category",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.trainingService.removeTrainingCategory(categrory.id, this.token);
          if (res && res.status == 200) {
            this.getTrainigCategory();
            this.toastrService.success("Training Category Deleted Successfully")
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
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public editDialog(element: TrainingCategory, basicmodal) {
    this.title = "Edit Training Category"
    this.trainingCategory = new TrainingCategory();
    this.trainingCategory = JSON.parse(JSON.stringify(element));
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
    if (element.childTrainingCategory && element.childTrainingCategory.length > 0) {
      this.isShowParentSelection = false;
    }
    else {
      this.isShowParentSelection = true;
    }
    this.selectedTrainingCategories = this.trainingCategories.filter(c => c.id != element.id)
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}