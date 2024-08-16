import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
import { UsersService } from 'src/app/shared/services/users.service';
declare let require;
const Swal = require('sweetalert2')
@Component({
  selector: 'app-contact-request',
  templateUrl: './contact-request.component.html',
  styleUrls: ['./contact-request.component.scss']
})
export class ContactRequestComponent implements OnInit {

  private token: string
  public title: string;
  public contactRequests = []
  public statuses = [
    {
      status: "New"
    },
    {
      status: "In Process"
    },
    {
      status: "Closed Won",
    },
    {
      status: "Closed Loss"
    },
    {
      status: "Closed"
    },
    {
      status: "Hold"
    }
  ]
  public displayColumns = ['id', 'name', 'contactNo', 'email', 'subject', 'message', 'contactDate', 'status', 'action']
  private selectedOrder = [];
  private isShowParentSelection: boolean = true;
  private isAlert: boolean = false;
  private alertType: string;
  private alertMessage: string;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  private startIndex: number;
  private fetchRecord: number;
  public paginate: any;
  public searchString: string;
  public isReadonly = true;
  public user: Users = new Users();
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public selectedOrderId: number;
  public selectedRemark: string
  public dateFrom: Date;
  public dateTo: Date;
  public selectedStatus: string
  public fromDate: Date
  public toDate: Date
  public selectedRequestStatus: string
  public selectedId: number

  constructor(
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private userService: UsersService,
    public toggleMenuService: ToggleMenuService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'order');
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
      await this.getContactRequest();
    }
  }

  public async getContactRequest() {
    try {
      this.spinnerService.show();

      let res = await this.userService.getContactRequest(this.startIndex, this.fetchRecord, this.selectedStatus, this.fromDate, this.toDate, this.token);
      if (res && res.status == 200) {
        this.contactRequests = res.recordList;
        if (this.contactRequests && this.contactRequests.length > 0) {
          this.contactRequests.forEach(ele => {
            ele.status = ele.status && ele.status != null ? ele.status : 'New'
            ele.color = '#fff'
            if (ele.status == 'In Process')
              ele.color = '#f9f9b6'
            else if (ele.status == 'Closed Won' || ele.status == 'Closed Loss' || ele.status == 'Closed')
              ele.color = '#ddd'
            else if (ele.status == 'Hold') {
              ele.color = '#f4d191'
            }
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public clearSearch() {
    this.fromDate = null;
    this.toDate = null;
    this.selectedStatus = null;
    this.setPage(1);
  }

  public closeDialog() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

  public changeStatus(basicmodal?: any) {
    let index = this.statuses.findIndex(c => c.status == this.selectedRequestStatus)
    let status = this.statuses[index].status
    Swal.fire({
      title: 'Change Status',
      text: 'Are you sure you want to change Status to "' + status + '" of this Request?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Change it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let res = await this.userService.changeStatus(this.selectedId, this.selectedRequestStatus, this.token)
          if (res && res.status == 200) {
            let index = this.contactRequests.findIndex(c => c.id == this.selectedId)

            Swal.fire(
              'SUCCESS',
              'Successfully Change Status',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
            this.contactRequests[index].status = this.selectedRequestStatus
            this.contactRequests[index].status = this.contactRequests[index].status && this.contactRequests[index].status != null ? this.contactRequests[index].status : 'New'
            this.contactRequests[index].color = '#fff'
            if (this.contactRequests[index].status == 'In Process')
              this.contactRequests[index].color = '#f9f9b6'
            else if (this.contactRequests[index].status == 'Closed Won' || this.contactRequests[index].status == 'Closed Loss' || this.contactRequests[index].status == 'Closed')
              this.contactRequests[index].color = '#ddd'
            else if (this.contactRequests[index].status == 'Hold') {
              this.contactRequests[index].color = '#f4d191'
            }
            this.contactRequests = [...this.contactRequests]
            this.modalService.dismissAll();
            this.spinnerService.hide();
          }
        }
        catch (error) {
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
    })
    const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public modalOpen(basicmodal, request) {
    this.selectedRequestStatus = request.status
    this.selectedId = request.id
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
}
