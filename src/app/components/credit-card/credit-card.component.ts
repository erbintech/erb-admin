import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { CreditCard } from 'src/app/shared/models/credit-card';
import { RejectionReason } from 'src/app/shared/models/rejectionReason';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
declare let require;
const Swal = require('sweetalert2')
@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  private startIndex: number;
  private fetchRecord: number;
  public title: string;
  public dateFrom: Date
  public dateTo: Date
  public customerId: number
  private token: string
  public customerCreditCards: CreditCard[] = new Array<CreditCard>();
  private alertMessage: string
  public displayColumns = ['id', 'creditCard', 'bnakCreditCard', 'Customer', 'contactNo', 'transactionDate', 'refrenceNo', 'status', 'createdDate', 'Action']
  public rejectReason = new FormControl();
  public reasonDescription = new FormControl();
  public reasons = [];
  public isAddMoreReason: boolean = false;
  public rejectionReason: RejectionReason;
  public reason: FormControl
  public isRejectionReason: boolean
  public reasonError: boolean
  public customerCreditCardId: number
  public creditCardStatuses = [];
  public isAllowStatusChange: boolean = false;
  public selectedCreditCardStatuses = [];
  public isChangeStatus: boolean
  public selectedStatus: number = null;

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private dsaService: DsaService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private creditCardService: CreditCardService,
    private paginationService: PaginationService,
    private modalService: NgbModal,
    public toggleMenuService: ToggleMenuService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'creditCard');
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
    await this.getCreditCardStatuses();
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getCustomerCreditCard();
    }
  }

  public async getCreditCardStatuses() {
    try {
      this.spinnerService.show();
      let res = await this.creditCardService.getCreditCardStatuses(this.token);
      if (res && res.status == 200) {
        this.creditCardStatuses = res.recordList;

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

  public async getCustomerCreditCard() {
    try {
      this.spinnerService.show();
      let res = await this.creditCardService.getCreditCard(this.startIndex, this.fetchRecord, this.dateFrom, this.dateTo, this.customerId, this.token);
      if (res && res.status == 200) {
        this.customerCreditCards = res.recordList;

      }
      this.count = res.totalRecords;
      this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
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

  public clearSearch() {
    this.dateFrom = null;
    this.dateTo = null;
    this.customerId = null
    this.getCustomerCreditCard();
  }

  public navigateViewDetail(elementId: number) {
    this.router.navigate(["/credit-card/view", elementId])
  }

  public openCreditCardRejectionModal(element: CreditCard, basicmodal) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Reject this Application",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject it !'
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.reasons = [];
        this.modalOpen(basicmodal, element, 'rejctionReason')
      }
    })
    const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public async modalOpen(basicmodal: any, obj: CreditCard, action: string) {
    this.customerCreditCardId = obj.id
    this.isRejectionReason = false;
    this.reasonError = false
    this.isAllowStatusChange = false;
    this.isChangeStatus = false;
    if (action == "rejctionReason") {
      this.title = "Insert Rejection Reson"
      this.reasons = [];
      this.rejectionReason = null;
      this.isAddMoreReason = false;
      this.reason = new FormControl();
      this.reasonDescription = new FormControl();
      this.rejectReason = new FormControl();
      if (obj.status == "REJECTED") {
        await this.getCreditCardrejectionReason();
        if (this.rejectionReason) {
          this.reason.setValue(this.rejectionReason.reason)
          this.reasons = this.rejectionReason.reasons
        }
      }
      this.isRejectionReason = true;
    }

    if (action == "changeStatus") {
      this.title = "Change Status"
      this.selectedCreditCardStatuses = null;
      this.getCreditCardStatuses();
      let selectedCreditCardStatuses = this.creditCardStatuses;
      if (obj.status) {
        selectedCreditCardStatuses.splice(0, selectedCreditCardStatuses.findIndex(c => c.status == obj.status))
      }
      this.selectedCreditCardStatuses = selectedCreditCardStatuses;
      this.selectedStatus = obj ? selectedCreditCardStatuses[0].id : null;
      this.isAllowStatusChange = true;
      this.isChangeStatus = true;
    }
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
  }

  public addMoreReason() {

    if (this.rejectReason.value) {
      if (this.reasonDescription.value) {
        let data = {
          "reason": this.rejectReason.value,
          "description": this.reasonDescription.value
        }
        this.reasons.push(data);
      }
    }
    this.rejectReason = new FormControl();
    this.reasonDescription = new FormControl();
    this.isAddMoreReason = true;
  }

  public async insertRejectionReason() {
    this.reasonError = false
    if (this.reason.value) {
      try {
        if (this.rejectReason.value) {
          if (this.reasonDescription.value) {
            let data = {
              "reason": this.rejectReason.value,
              "description": this.reasonDescription.value
            }
            this.reasons.push(data);
          }
        }
        let id = this.rejectionReason ? this.rejectionReason.id : null;
        let res = await this.creditCardService.insertRejectionReason(id, this.customerCreditCardId, this.reason.value, this.reasons, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.customerCreditCards[this.customerCreditCards.findIndex(c => c.id == this.customerCreditCardId)].status = "REJECTED"
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
        this.toastrService.error(this.alertMessage)
      }
    }
    else {
      this.reasonError = true
    }
  }

  public async getCreditCardrejectionReason() {
    try {
      let res = await this.creditCardService.getCreditCardRejectionReason(this.customerCreditCardId, this.token);
      if (res && res.status == 200) {
        this.rejectionReason = res.recordList;
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public removeReason(reason, index: number) {
    this.reasons.splice(index, 1);
  }

  public async changeStatus() {
    try {
      let res = await this.creditCardService.changeCreditCardStatuses(this.customerCreditCardId, this.selectedStatus, this.token);
      if (res && res.status == 200) {
        let index = this.customerCreditCards.findIndex(c => c.id == this.customerCreditCardId);
        this.customerCreditCards[index].statusId = this.selectedStatus
        this.customerCreditCards[index].status = this.selectedCreditCardStatuses.find(c => c.id == this.selectedStatus).status

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
      this.toastrService.error(this.alertMessage)
    }
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let res = await this.creditCardService.getCreditCard(null, null, this.dateFrom, this.dateTo, this.customerId, this.token);
      let creditCard = [];
      if (res && res.status == 200) {
        creditCard = res.recordList;
        if (creditCard && creditCard.length > 0) {
          for (let index = 0; index < creditCard.length; index++) {
            creditCard[index].code = creditCard[index].permanentCode ? creditCard[index].permanentCode : creditCard[index].temporaryCode

          }
        }
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(creditCard);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['BankName', 'CreditCardName', 'JoiningFee', 'RenualFee', 'CustomerName', 'ContactNo', 'TransactionDate', 'Reference', 'Status']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'CREDITCARD_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      let transactionDate = '';
      if (array[j].creditCardTransactionDate) {
        transactionDate = new Date(array[j].creditCardTransactionDate).getFullYear() + "-" + ("0" + (new Date(array[j].creditCardTransactionDate).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date(array[j].creditCardTransactionDate).getDate())).slice(-2);
      }
      let bankName = array[j].bankName ? array[j].bankName : null;
      let creditCardName = array[j].creditCardName ? array[j].creditCardName : null;
      let joiningfee = array[j].joiningfee ? array[j].joiningfee : null;
      let renualfee = array[j].renualfee ? array[j].renualfee : null;
      let referenceNo = array[j].referenceNo ? array[j].referenceNo : null;
      line += '\n' + (j + 1) + ',' + bankName + ',' + creditCardName + ',' + joiningfee + ',' + renualfee + ',' + array[j].fullName + ',' + array[j].contactNo + ',' + transactionDate + ',' + referenceNo + ',' + array[j].status
    }
    str += line + '\r\n';
    return str;
  }

  public navigateEditCard(ele) {
    let route = "/credit-card/edit/" + ele.customerId + "/" + ele.id
    this.router.navigate([route])
  }
}