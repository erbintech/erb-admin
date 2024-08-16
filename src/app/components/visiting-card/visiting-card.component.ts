import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Roles } from 'src/app/shared/models/roles';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { VisitingCards } from 'src/app/shared/models/visiting-card';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { VisitingCardService } from 'src/app/shared/services/visiting-card.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-visiting-card',
  templateUrl: './visiting-card.component.html',
  styleUrls: ['./visiting-card.component.scss']
})
export class VisitingCardComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private isShowParentSelection: boolean = true;
  private selectedVisitingCard = [];
  private startIndex: number;
  private fetchRecord: number;
  public values: [];
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  private skip: number = 0;
  public selectedRoleIds = [];

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;


  public title: string;
  public visitingCards: VisitingCards[] = new Array<VisitingCards>();
  public visitingCard: any;
  public roles = [];
  public orgRoles = new Roles();
  public user: Users = new Users();
  public displauColumns: ["id", "template", "roleIds"]
  public paginate: any;
  public searchString: string;
  public roleId: any[];


  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private visitingCardService: VisitingCardService,
    private modalService: NgbModal
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'visitingCard');
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
    await this.getAllRoles();
    await this.setPage(1);
  }

  visitingCardform = new FormGroup({
    'template': new FormControl(''),
    'roleIds': new FormControl()
  });

  public async getAllRoles() {
    try {
      this.spinnerService.show();
      let res = await this.visitingCardService.getAllRoles(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.orgRoles = res.recordList;
        this.roles = res.recordList;
        if (this.roles && this.roles.length > 0) {
          this.roles = this.roles.filter(c => c.name == "DSA" || c.name == "SUBDSA" || c.name == "CONNECTOR" || c.name == "EMPLOYEE")
          this.roleId = this.roles.map((c: any) => c.id)
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

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getVisitingCards();
    }
  }

  public async getVisitingCards() {
    try {
      this.spinnerService.show();
      let roleIds = this.selectedRoleIds ? this.selectedRoleIds : null;
      let res = await this.visitingCardService.getVisitingCards(this.startIndex, this.fetchRecord, roleIds, this.token);
      if (res && res.status == 200) {
        this.visitingCards = res.recordList;

        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);

        if (this.visitingCards && this.visitingCards.length > 0) {
          for (let index = 0; index < this.visitingCards.length; index++) {
            this.visitingCards[index].roleName = [];
            for (let j = 0; j < this.visitingCards[index].roleIds.length; j++) {
              let name = this.roles.find(c => c.id == this.visitingCards[index].roleIds[j]).name;
              this.visitingCards[index].roleName.push(name);
            }
          }
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public modalOpen(basicmodal: any) {
    this.selectedRoleIds = [];
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
    this.title = "Insert Visiting Card";
    this.visitingCard = new VisitingCards();
    this.isShowParentSelection = true;
    this.selectedVisitingCard = this.visitingCards;
    this.visitingCardform.reset();
  }

  public async insertVisitingCard() {
    try {
      if (this.visitingCardform.valid) {
        this.spinnerService.show();
        if (this.visitingCard.id) {
          let id = this.visitingCard.id;
          let location = this.visitingCard.location ? this.visitingCard.location : null;
          this.visitingCard = this.visitingCardform.value;
          this.visitingCard.id = id;
          this.visitingCard.location = location

          this.visitingCard.roleIds = this.visitingCard.roleIds ? this.visitingCard.roleIds : null
          let res = await this.visitingCardService.updateVisitingCard(this.visitingCard.id, this.visitingCard.template, this.visitingCard.roleIds, this.visitingCard.location, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getVisitingCards();
          }
        }
        else {
          this.visitingCard = this.visitingCardform.value;
          let res = await this.visitingCardService.insertVisitingCard(this.visitingCard.template, this.visitingCard.roleIds, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getVisitingCards();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.visitingCardform.controls).forEach(key => {
          this.visitingCardform.controls[key].markAsTouched();
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

  public editDialog(element: VisitingCards, basicmodal) {
    this.title = "Edit Visiting Card"
    this.visitingCard = new VisitingCards();
    this.visitingCard = element;
    this.visitingCardform.setValue({
      "template": this.visitingCard.template,
      "roleIds": this.visitingCard.roleIds,
    })
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
    this.selectedVisitingCard = this.visitingCards.filter(c => c.id != element.id);

  }

  public changeStatus(visitingCard: VisitingCards) {
    let active = visitingCard.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Visiting Card",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.visitingCardService.activeInactiveVisitingCard(visitingCard.id, visitingCard.isActive, this.token);
          if (res && res.status == 200) {
            this.getAllRoles();
            Swal.fire(
              active,
              'Successfully ' + active + ' Visiting Card',
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
        visitingCard.isActive = !visitingCard.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

  public clearSearch() {
    this.searchString = null;
    this.selectedRoleIds = null;
    this.getVisitingCards();
  }


}