import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CoApplicantRelation } from 'src/app/shared/models/co-applicant-relation';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { CoApplicantRelationService } from 'src/app/shared/services/co-applicant-relation.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-co-applicant-relation',
  templateUrl: './co-applicant-relation.component.html',
  styleUrls: ['./co-applicant-relation.component.scss']
})
export class CoApplicantRelationComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private isShowParentSelection: boolean = true;
  private selectedCoApplicantRelaton = [];
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;

  public user: Users = new Users();
  public title: string;
  public displayColumns = ["id","name", "Status", "Action"];
  public coApplicantRelatons: CoApplicantRelation[] = new Array<CoApplicantRelation>();
  public coApplicantRelaton:any = new CoApplicantRelation();
  public paginate: any;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;


  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private coApplicantRelationService: CoApplicantRelationService,
    private modalService: NgbModal
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'coApplicantRelation');
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

  coApplicantRelatonform = new FormGroup({
    'name': new FormControl('', Validators.required),
  });

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getCoApplicantRelation();
    }
  }

  public async getCoApplicantRelation() {
    try {
      this.spinnerService.show();
      let res = await this.coApplicantRelationService.getCoApplicantRelation(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.coApplicantRelatons = res.recordList;

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

  public async insertPropertyType() {
    try {
      if (this.coApplicantRelatonform.valid) {
        this.spinnerService.show();
        if (this.coApplicantRelaton.id) {
          let id = this.coApplicantRelaton.id;
          this.coApplicantRelaton = this.coApplicantRelatonform.value;
          this.coApplicantRelaton.id = id;
          let res = await this.coApplicantRelationService.updateCoApplicantRelation(this.coApplicantRelaton.id, this.coApplicantRelaton.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getCoApplicantRelation();
          }
        }
        else {
          this.coApplicantRelaton = this.coApplicantRelatonform.value;
          let res = await this.coApplicantRelationService.insertCoApplicantRelation(this.coApplicantRelaton.name, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getCoApplicantRelation();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.coApplicantRelatonform.controls).forEach(key => {
          this.coApplicantRelatonform.controls[key].markAsTouched();
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

  public changeStatus(coApplicantRelaton: CoApplicantRelation) {
    let active = coApplicantRelaton.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Co-applicant Relation",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.coApplicantRelationService.activeInactiveCoApplicantRelation(coApplicantRelaton.id, coApplicantRelaton.isActive, this.token);
          if (res && res.status == 200) {
            this.getCoApplicantRelation();
            Swal.fire(
              active,
              'Successfully ' + active + ' Co-applicant Relation',
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
        coApplicantRelaton.isActive = !coApplicantRelaton.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public modalOpen(basicmodal: any) {
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, {windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert Co-applicant Relation";
    this.coApplicantRelaton = new CoApplicantRelation();
    this.isShowParentSelection = true;
    this.selectedCoApplicantRelaton = this.coApplicantRelatons;
    this.coApplicantRelatonform.reset();
  }

  public editDialog(element: CoApplicantRelation, basicmodal) {
    this.title = "Edit Co-applicant Relation"
    this.coApplicantRelaton = new CoApplicantRelation();
    this.coApplicantRelaton = element;
    this.coApplicantRelatonform.setValue({
      "name": this.coApplicantRelaton.name
    })
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, {windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.selectedCoApplicantRelaton = this.coApplicantRelatons.filter(c => c.id != element.id);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

}
