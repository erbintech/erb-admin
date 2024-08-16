import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { Dsa } from 'src/app/shared/models/dsa';
import { Services } from 'src/app/shared/models/service';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BankService } from 'src/app/shared/services/bank.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { PayoutService } from 'src/app/shared/services/payout.service';
import { ServicesService } from 'src/app/shared/services/services.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss']
})
export class PayoutComponent implements OnInit {

  private token: string
  private alertMessage: string;
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  public title: string;
  public displayColumns = ["id", "partner", "totalIN", "totalOut", "action"];
  public displayHistoryColumns = ["id", "commission","commissionPercent", "serviceName", "bankName", "loanDetail", 'releaseDate', 'release', "view"];
  public paginate: any;
  public searchString: string
  public partnerPayouts = [];
  public payoutHistory = [];
  public partnerCommission: number
  public payout = new FormControl('', [Validators.required]);
  public commissionError: boolean
  public partnerPayout: any;
  public dsa = new Dsa();
  public bankDetailForm: FormGroup;
  public banks = [];
  public isInsertBankDetail: boolean
  public isPayoutHistory: boolean
  public isInsertPayout: boolean
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public selectedService:number
  public fromDate:Date
  public toDate:Date
  public services: Services[] = new Array<Services>();

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private payoutService: PayoutService,
    private modalService: NgbModal,
    private dsaService: DsaService,
    private bankService: BankService,
    private loanservice: ServicesService,
    public toggleMenuService: ToggleMenuService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'payout');
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
    this.bankDetailForm = new FormGroup({
      'accountHolderName': new FormControl('', Validators.required),
      'bankId': new FormControl('', Validators.required),
      'ifscCode': new FormControl('', Validators.required),
      'accountNo': new FormControl('', Validators.required),
    })
    await this.getBanks();
    await this.getServices();
  }

  public async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.loanservice.getServices(null, null, this.token);
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

  public async getBanks() {
    try {
      this.spinnerService.show();
      let res = await this.bankService.getBanks(this.startIndex, this.fetchRecord, null, this.token);
      if (res && res.status == 200) {
        this.banks = res.recordList;
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
      await this.getPartnerPayout();
    }
  }

  public async getPartnerPayout() {
    try {
      this.spinnerService.show()
      this.searchString = this.searchString ? this.searchString : null;
      let res = await this.payoutService.getPartnerPayout(this.startIndex, this.fetchRecord, this.searchString,this.fromDate,this.toDate,this.selectedService, this.token);
      if (res && res.status == 200) {
        this.partnerPayouts = res.recordList;
        this.partnerPayouts.forEach(ele => {
          ele.totalIn = 0;
          ele.totalOut = 0;
          ele.payoutHistory.forEach(historyele => {
              ele.totalIn += historyele.commission
        if(historyele.isReleased)
          ele.totalOut += historyele.commission             
          })
        })
      }
      this.spinnerService.hide();
      this.count = res.totalRecords;
      this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
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

  public viewPayoutHistory(id: number, basicmodal) {
    this.isInsertBankDetail = false;
    this.isPayoutHistory = true
    this.isInsertPayout = false
    this.partnerCommission = null;
    let index = this.partnerPayouts.findIndex(c => c.id == id);
    this.payoutHistory = this.partnerPayouts[index].payoutHistory;
    // this.modalService.open(basicmodal, { size: "xl" })
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

  public async payoutRelease(id: number, basicmodal) {
    this.isInsertBankDetail = false;
    // this.isPayoutHistory = false
    this.isInsertPayout = false
    let index = this.payoutHistory.findIndex(c => c.id == id);
    this.partnerPayout = this.payoutHistory[index];
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Release this payout",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Release it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          await this.insertPayout()
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
  public closeDialog() {
    this.partnerCommission = null;
    this.isInsertBankDetail = false;
    this.isPayoutHistory = false
    this.isInsertPayout = false
    this.modalService.dismissAll();
  }

  public checkPayout() {
    let payout:any = this.payout.value;
    let difference = this.partnerCommission - payout;
    if (difference < 0)
      this.commissionError = true;
    else
      this.commissionError = false;
  }

  public async insertPayout() {
    try {
      this.spinnerService.show();
      let res = await this.payoutService.payoutRelease(this.partnerPayout.partnerId, this.partnerPayout.commission, this.partnerPayout.id,this.partnerPayout.loanDetailId,this.partnerPayout.serviceName, this.token)
      if (res && res.status == 200) {
        let index = this.partnerPayouts.findIndex(c => c.partnerId == this.partnerPayout.partnerId);
        this.partnerPayouts[index].totalOut += parseInt(this.partnerPayout.commission)
        this.partnerPayouts[index].payoutHistory[this.partnerPayouts[index].payoutHistory.findIndex(c=>c.id == this.partnerPayout.id)].isReleased = true;
        this.partnerPayouts[index].payoutHistory[this.partnerPayouts[index].payoutHistory.findIndex(c=>c.id == this.partnerPayout.id)].releaseDate = new Date();
        this.partnerPayouts[index].payoutHistory[this.partnerPayouts[index].payoutHistory.findIndex(c=>c.id == this.partnerPayout.id)].url = res.recordList.invoiceUrl
        Swal.fire(
          'SUCCESS',
          'Successfully Release Payout',
          'success'
        )
        const modalContent = document.querySelector('.swal2-container');
        sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
        this.modalService.dismissAll();
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
    this.searchString = null;
    this.fromDate = null;
    this.toDate = null;
    this.selectedService = null;
    this.getPartnerPayout();
  }

  public getFilterPayout() {
    this.startIndex = 0;
    this.fetchRecord = this.take;
    this.getPartnerPayout();
  }

  public async getPartnerDetailByPartnerId(partnerId: number) {
    try {
      this.spinnerService.show();
      let res = await this.dsaService.getPartnerDetailByPartnerId(partnerId, this.token);
      if (res && res.status == 200) {
        if (res.recordList && res.recordList.length > 0)
          this.dsa = res.recordList[0];
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
      this.toastrService.error(error);
    }
  }
  public openEditBankDetailDialog() {
    this.isInsertBankDetail = true
    this.isInsertPayout = false;
    this.bankDetailForm.reset();
    this.bankDetailForm.setValue({
      "accountHolderName": this.dsa.partnerBankDetail.accountHolderName,
      "accountNo": this.dsa.partnerBankDetail.accountNo,
      "bankId": this.dsa.partnerBankDetail.bankId,
      "ifscCode": this.dsa.partnerBankDetail.ifscCode
    })
  }
  public async insertUpdateBankDetail() {
    try {
      if (this.bankDetailForm.valid) {
        this.spinnerService.show();
        let id = this.dsa.partnerBankDetail?.partnerBankDetailId ? this.dsa.partnerBankDetail.partnerBankDetailId : null;
        let bankDetail = this.bankDetailForm.value
        let res = await this.dsaService.insertUpdatePartnerBankDetail(id, this.partnerPayout.partnerId, bankDetail.accountHolderName, bankDetail.accountNo, bankDetail.ifscCode, bankDetail.bankId, this.token);
        if (res && res.status == 200) {
          if (res.recordList && res.recordList.length > 0)
            this.dsa.partnerBankDetail = res.recordList[0]
          this.dsa.partnerBankDetail.partnerBankDetailId = res.recordList[0].id
          this.isInsertPayout = true
          this.isInsertBankDetail = false
          this.title = "Payout Release"
          this.partnerCommission = this.partnerPayout.commission
        }
        this.spinnerService.hide();
      }
      else {
        Object.keys(this.bankDetailForm.controls).forEach(key => {
          this.bankDetailForm.controls[key].markAsTouched();
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
      this.toastrService.error(error);
    }
  }

  public keyPressAlphanumeric(event) {
    let inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9 ]/.test(inp)) {
      // only alphabet a-z A-Z
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      AppComponent.text = "Generate CSV";
      this.downloadFile(this.payoutHistory);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['Commission', 'Commission(IN %)', 'Service', 'Bank', 'Amount Disbursed', 'Customer Name','customer ContactNo', 'ReleaseDate']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'PayoutHistory_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      let bdt = '';
      let releaseDate = '';
      if (array[j].releaseDate) {
        releaseDate = new Date(array[j].releaseDate).getFullYear() + "-" + ("0" + (new Date(array[j].releaseDate).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date(array[j].releaseDate).getDate())).slice(-2);
      }
      let commissionPercent = array[j].commissionPercent ? array[j].commissionPercent + '%': ''
      let serviceName = array[j].serviceName ? array[j].serviceName : ''
      let bankName = array[j].bankName ? array[j].bankName : ''
      let fullName = array[j].fullName ? array[j].fullName : ''
      let contactNo = array[j].contactNo ? array[j].contactNo : ''
      let amountDisbursed = array[j].amountDisbursed ? '₹' + array[j].amountDisbursed : ''
      line += '\n' + (j + 1) + ',' + ('₹' + array[j].commission) + ',' +(commissionPercent) + "," + serviceName +  "," + bankName  + "," + amountDisbursed + "," + fullName + "," + contactNo + ',' + releaseDate

    }
    str += line + '\r\n';
    return str;
  }
}