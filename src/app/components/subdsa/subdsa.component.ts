import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { Dsa } from 'src/app/shared/models/dsa';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BadgeService } from 'src/app/shared/services/badges.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-subdsa',
  templateUrl: './subdsa.component.html',
  styleUrls: ['./subdsa.component.scss']
})
export class SubdsaComponent implements OnInit {
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public subdsa: Dsa[] = new Array<Dsa>();

  public isAlert: boolean;
  public alertType: string;//["success","danger","warning"]
  public alertMessage: string;
  public token: string;
  public searchString: string;
  public selectedStatus: string;
  public dsaColumns = ['id', 'code', 'name', 'contactNo', 'dsaCode', 'city', 'totalApplication', 'loanAmontMonth', 'loanAmount', 'pending', 'badge','createdDate', 'isDelete', 'status', 'action']
  public badges = [];
  public badgeId = new FormControl();
  public partnerId: number
  public selectedBadge: number
  public isDelete: string;
  public dateFrom: Date
  public dateTo: Date
  public isFlag: boolean = true;
  public status = [{
    "id": 1,
    "name": "Approved"
  },
  {
    "id": 2,
    "name": "DisApproved"
  }]

  public userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    private dsaService: DsaService,
    private router: Router,
    private badgeService: BadgeService,
    private toastrService: ToastrService,
    public toggleMenuService: ToggleMenuService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this.userPagePermission.findIndex(c => c.name == 'subdsa');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isReadPermission = (roleId == 1) ? true : this.userPagePermission[ind].readPermission;
        this.isWritePermission = (roleId == 1) ? true : this.userPagePermission[ind].writePermission;
        this.isEditPermission = (roleId == 1) ? true : this.userPagePermission[ind].editPermission;
        this.isDeletePermission = (roleId == 1) ? true : this.userPagePermission[ind].deletePermission;
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
    await this.getBadges();
  }

  public async getBadges() {
    try {
      this.spinnerService.show();
      let res = await this.badgeService.getBadges(null, null, this.token);
      if (res && res.status == 200) {
        this.badges = res.recordList;
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
      await this.getSubDsa();
    }
  }

  public async getSubDsa() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let status = this.selectedStatus ? this.selectedStatus : null;
      let badgeId = this.selectedBadge ? this.selectedBadge : null
      let isDelete = this.isDelete ? (this.isDelete == 'Yes' ? true : false) : null
      let res = await this.dsaService.getDsa(this.startIndex, this.fetchRecord, 'SUBDSA', this.token, searchString, status, badgeId, isDelete, this.dateFrom, this.dateTo);
      if (res && res.status == 200) {
        this.subdsa = res.recordList;
        if (this.subdsa && this.subdsa.length > 0) {
          for (let index = 0; index < this.subdsa.length; index++) {
            this.subdsa[index].code = this.subdsa[index].permanentCode ? this.subdsa[index].permanentCode : this.subdsa[index].temporaryCode
            this.subdsa[index].isDisabled = this.subdsa[index].isDisabled ? true : false;
          }
        }
        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
      }
      if(this.subdsa.length > 0){
        this.isFlag = true
      } else {
        this.isFlag = false
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
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

  public verifiedPartner(element) {
    let Verified = element.isDisabled ? 'approved' : 'disApproved'
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't " + Verified + " this SUBDSA",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + Verified + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.dsaService.VerifiedDsa(element.id, element.userId, !element.isDisabled, element.permanentCode, element.temporaryCode, this.token);
          if (res && res.status == 200) {
            element.isDisabled = !element.isDisabled;
            Swal.fire(
              Verified,
              'Successfully ' + Verified + " SUBDSA",
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
          this.isAlert = true;
          this.alertType = "danger";
          setTimeout(() => {
            this.isAlert = false;
          }, 2000);
        }

      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public warningAlert(dsa: Dsa) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Delete this Subdsa",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          dsa.partnerId = dsa.id;
          let res = await this.dsaService.deletePartnerByPartnerId(dsa.id, dsa.partnerId, this.token);
          if (res && res.status == 200) {
            this.getSubDsa();
            Swal.fire(
              'DELETE',
              'Successfully Deleted Subdsa',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
            // this.toastrService.success("Subdsa Deleted Successfully")
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


  public clearSearch() {
    this.searchString = null;
    this.selectedStatus = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedBadge = null;
    this.isDelete = null;
    this.getSubDsa();
  }

  public addSubDsa() {
    this.router.navigate(["subdsa/add"]);
  }

  public async editSubdsa(element: Dsa) {
    this.router.navigate(["subdsa/edit", element.id]);
  }

  public async viewDetail(element: Dsa) {
    this.router.navigate(["subdsa/view", element.id])
  }

  public changeBadge(element, commissionModal) {
    // this.modalService.open(commissionModal)
    this.modalService.open(commissionModal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.partnerId = element.id
    this.badgeId.setValue(this.badges.find(c => c.name == element.badgeName).id)
  }

  public async assignBadge() {
    if (this.badgeId) {
      try {
        this.spinnerService.show();
        let res = await this.dsaService.changeBadge(this.partnerId, this.badgeId.value, this.token)
        if (res && res.status == 200) {
          this.subdsa[this.subdsa.findIndex(c => c.id == this.partnerId)].badgeName = this.badges.find(c => c.id == this.badgeId.value).name
          this.spinnerService.hide();
          this.modalService.dismissAll();
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
    else {
      this.badgeId.markAsTouched();
    }
  }

  public async filterSubDsa() {
    this.startIndex = 0;
    this.fetchRecord = this.take
    this.activePage = 1;
    await this.getSubDsa();
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let status = this.selectedStatus ? this.selectedStatus : null;
      let badgeId = this.selectedBadge ? this.selectedBadge : null
      let isDelete = this.isDelete ? (this.isDelete == 'Yes' ? true : false) : null
      let res = await this.dsaService.getDsa(null, null, 'SUBDSA', this.token, searchString, status, badgeId, isDelete, this.dateFrom, this.dateTo);
      let subDsa = [];
      if (res && res.status == 200) {
        subDsa = res.recordList;
        if (subDsa && subDsa.length > 0) {
          for (let index = 0; index < subDsa.length; index++) {
            subDsa[index].code = subDsa[index].permanentCode ? subDsa[index].permanentCode : subDsa[index].temporaryCode
          }
        }
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(subDsa);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['Code', 'Name', 'ContactNo','DSACode', 'City', 'TotalApplication', 'LoanAmontMonth', 'LoanAmount', 'PendingApplication', 'Badge', 'createdDate', 'Status', 'isDelete']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'SUBDSA_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
    dwldLink.setAttribute("download", fileName + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  private ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    let line = '';
    for (let j = 0; j < array.length; j++) {
      let createdDate = '';
      if (array[j].createdDate) {
        createdDate = new Date(array[j].createdDate).getFullYear() + "-" + ("0" + (new Date(array[j].createdDate).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date(array[j].createdDate).getDate())).slice(-2);
      }
      let totalApplication = array[j].totalApplicationReceived ? array[j].totalApplicationReceived : 0
      let thisMonthAmount = array[j].thisMonthAmount ? '₹' + array[j].thisMonthAmount.toFixed(2) : 0.00
      let totalAmount = array[j].totalAmount ? '₹' + array[j].totalAmount.toFixed(2) : 0
      let totalPending = array[j].totalPending ? array[j].totalPending : ''
      let status = array[j].isDisabled ? 'DisApproved' : 'Approved';
      let isDelete = array[j].isDelete ? 'Yes' : 'No'
      line += '\n' + (j + 1) + ',' + array[j].code + ',' + array[j].fullName + "," + array[j].contactNo + "," + array[j].networkCode + "," + array[j].cityName + ',' + totalApplication + ',' + thisMonthAmount + ',' + totalAmount + `,` + totalPending + ',' + array[j].badgeName + ',' + createdDate + ',' + status + ',' + isDelete

    }
    str += line + '\r\n';
    return str;
  }
}