import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Bank } from 'src/app/shared/models/bank';
import { LoanDetail } from 'src/app/shared/models/loanDetail';
import { AdminBusinessLoanResponse } from 'src/app/shared/models/loans/adminBusinessLoanResponse';
import { AdminPersonalLoanResponse } from 'src/app/shared/models/loans/adminPersonalLoanResponse';
import { LoanStatuses } from 'src/app/shared/models/loanStatus/loanStatuses';
import { Offer } from 'src/app/shared/models/offer';
import { RejectionReason } from 'src/app/shared/models/rejectionReason';
import { Users } from 'src/app/shared/models/users/user';
import { BankService } from 'src/app/shared/services/bank.service';
import { BusinessLoanService } from 'src/app/shared/services/businessLoan.service';
import { LoanStatusService } from 'src/app/shared/services/loanStatus.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { PersonalLoanService } from 'src/app/shared/services/personalLoan.service';
import { UsersService } from 'src/app/shared/services/users.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";
import { AdminPersonalLoanDocumentResponse } from 'src/app/shared/models/loans/adminPersonalloanDocumentsResponse';
import { BusinessNature } from 'src/app/shared/models/business-nature';
import { LoanOffer } from 'src/app/shared/models/loanOffer';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { CommissionService } from 'src/app/shared/services/commissionType.service';
import { AppComponent } from 'src/app/app.component';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any
};
declare let require;
const Swal = require('sweetalert2')
@Component({
  selector: 'app-businessloan',
  templateUrl: './businessloan.component.html',
  styleUrls: ['./businessloan.component.scss']
})
export class BusinessloanComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public isAlert: boolean = false;
  public alertType: string;//["success","danger","warning"]
  public alertMessage: string;
  public token: string;

  public displayColumns = ["id", "Customer", "ContactNo", "Email", "LoanAmount", "Employment", "Status", "DSACode", "rmFullName", "isDelete", 'createdDate', "Action"];
  public offerColumn = ['id', 'bankName', 'cibilScore', 'age', 'roi', 'tenure', 'workExperience', 'minimumIncome']
  public businessLoans: AdminBusinessLoanResponse[] = new Array<AdminBusinessLoanResponse>();
  public businessLoan = new AdminBusinessLoanResponse();
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public loanOffers: LoanOffer[] = new Array<LoanOffer>();
  public loanStatuses: LoanStatuses[] = new Array<LoanStatuses>();
  public selectedLoanStatuses = [];
  public selectedStatus: number = null;
  public selectedLoanStatus: number = null;
  public dateFrom: Date;
  public dateTo: Date;
  public isAllowStatusChange: boolean
  public isCheckEligibility: boolean


  public rmUsers: Users[] = new Array<Users>();
  public selectedRM = [];
  // public selectedRM: Users;
  public myControl = new FormControl();
  public filteredOptions: Observable<Users[]>;
  public selectedCustomerLoanId: number;
  public rmError: boolean = false;
  public offers: Offer[] = new Array<Offer>();
  public isRmAssign: boolean;
  public isVerifyDocument: boolean;
  public isChangeStatus: boolean;
  public isGenerateOffer: boolean;
  public isRejectionReason: boolean;
  public title: string;
  public isOfferDialog: boolean;
  public isGenerateDetail: boolean;
  public offer = new Offer();
  public htmlContent: string;
  public emi: number;
  public interest: number;
  public displayInterset: string
  public displayPayment: string
  public payment: number;
  public loanDetail = new LoanDetail();
  public banks: Bank[] = new Array<Bank>();
  public fileName: string;
  public loanDetailForm: FormGroup;
  public rejectReason = new FormControl();
  public reasonDescription = new FormControl();
  public reasons = [];
  public isAddMoreReason: boolean = false;
  public isFlag: boolean = true;
  public rejectionReason: RejectionReason;
  public reasonError: boolean = false;
  public reason = new FormControl();
  public businessNatures: BusinessNature[] = new Array<BusinessNature>();
  public loanOffer = new LoanOffer();
  public offerForm: FormGroup
  public searchString: string
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
  }

  public userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private businessLoanService: BusinessLoanService,
    private personalLoanService: PersonalLoanService,
    private loanStatusService: LoanStatusService,
    private paginationService: PaginationService,
    private usersService: UsersService,
    private router: Router,
    private toasterService: ToastrService,
    private bankService: BankService,
    private toastrService: ToastrService,
    private commissionService: CommissionService,
    public toggleMenuService: ToggleMenuService
  ) {
    this.loanDetailForm = formBuilder.group({
      'refrenceNo': [null, [Validators.required]],
      'email': [null, [Validators.required]],
      'amountDisbursed': [null, [Validators.required]],
      'ROI': [null, [Validators.required]],
      'bankId': [null, [Validators.required]],
      'tenure': [null, [Validators.required]],
      'termsCondition': [null]
    });
    this.offerForm = formBuilder.group({
      "bankId": [null, [Validators.required]],
      "loanAmount": [null, [Validators.required]],
      "ROI": [null, [Validators.required]],
      "tenure": [null, [Validators.required]],
      "otherDetail": [null, [Validators.required]],
    })
    this.chartOptions = {
      series: [86, 14],
      chart: {
        width: 380,
        type: "pie"
      },
      colors: ["rgb(136, 168, 37)", "rgb(237, 140, 43)"],
      labels: ["Principal LoanAmount", "Interest Amount"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],

    };

    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this.userPagePermission.findIndex(c => c.name == 'business-loan');
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
    await this.getLoanStatuses();
    await this.setPage(1);
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getBusinessLoan();
    }
  }

  public async getBusinessLoan() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null
      let res = await this.businessLoanService.getBusinessLoans(2, null, this.startIndex, this.fetchRecord, this.token, this.dateFrom, this.dateTo, this.selectedStatus, searchString);
      if (res && res.status == 200) {
        this.businessLoans = res.recordList;
        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
      }
      if(this.businessLoans.length > 0){
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
      this.toasterService.error(this.alertMessage)
    }
  }

  public async clearSearch() {
    this.selectedStatus = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.searchString = null;
    await this.getBusinessLoan();
  }

  private async getLoanStatuses() {
    try {
      let res = await this.loanStatusService.getLoanStatus(this.token);
      if (res && res.status == 200) {
        this.loanStatuses = res.recordList;
        this.loanStatuses = this.loanStatuses.filter(c => c.status != 'REJECTED')
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
      this.toasterService.error(error)
    }
  }

  public viewDetail(obj) {
    this.router.navigate(["business-loan/view/", obj.basicDetail.customerLoanId]);
  }

  public getStatus(e, doc: AdminPersonalLoanDocumentResponse) {
    let index = this.businessLoan.loanDocuments.findIndex(c => c.loanDocumentId == doc.loanDocumentId);
    this.businessLoan.loanDocuments[index].documentStatus = e.target.value;
  }

  public closeDialog() {
    this.modalService.dismissAll();
  }

  public warningAlert(personalLoan: AdminPersonalLoanResponse) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Delete this Business Loan",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.personalLoanService.deleteLoanById(personalLoan.basicDetail.customerLoanId, this.token);
          if (res && res.status == 200) {
            this.getBusinessLoan();
            Swal.fire(
              'DELETE',
              'Successfully Deleted Business Loan',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
            // this.toastrService.success("Business Loan Deleted Successfully")
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
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public navigateCustomerDetail(ele) {
    this.router.navigate(["customer/view", ele.basicDetail.customerId]);
  }

  public async filterLoans() {
    this.startIndex = 0;
    this.fetchRecord = this.take;
    await this.setPage(1);
  }

  public navigateEditLoanPage(customerloan: AdminBusinessLoanResponse) {
    let customerLoanId = sessionStorage.getItem("customerLoanId");
    if (customerLoanId)
      sessionStorage.removeItem("customerLoanId")
    let route = 'business-loan' + '/edit/' + customerloan.basicDetail.customerId + "/" + customerloan.basicDetail.customerLoanId;
    this.router.navigate([route])
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.businessLoanService.getBusinessLoans(2, null, null, null, this.token, this.dateFrom, this.dateTo, this.selectedStatus, searchString);
      let businessLoans = [];
      if (res && res.status == 200) {
        businessLoans = res.recordList;
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(businessLoans);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['Name', 'ContactNo', 'Email', 'LoanAmount', 'Employment', 'Status', 'FIle Source', 'Assigned RM', 'Request Date']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'BusinessLoan_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      if (array[j].basicDetail?.createdDate) {
        createdDate = new Date(array[j].basicDetail?.createdDate).getFullYear() + "-" + ("0" + (new Date(array[j].basicDetail?.createdDate).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date(array[j].basicDetail?.createdDate).getDate())).slice(-2);
      }
      let employmentType = array[j].basicDetail?.employmentType ? array[j].basicDetail?.employmentType : ''
      let status = array[j].basicDetail?.status ? array[j].basicDetail?.status : 'PENDING'
      let rmFullName = array[j].basicDetail?.rmFullName ? array[j].basicDetail?.rmFullName : ''
      let email = array[j].basicDetail?.email ? array[j].basicDetail?.email : ''
      let fileSource;
      if (array[j].basicDetail.partnerId && !array[j].basicDetail.leadId)
        fileSource = 'Channel Partner';
      if (!array[j].basicDetail.partnerId && !array[j].basicDetail.leadId)
        fileSource = 'Direct';
      if (array[j].basicDetail.leadId)
        fileSource = 'From Lead'
      line += '\n' + (j + 1) + ',' + array[j].basicDetail?.fullName + "," + array[j].basicDetail.contactNo + "," + email + ',' + array[j].basicDetail.loanAmount + ',' + employmentType + ',' + status + ',' + fileSource + ',' + rmFullName + ',' + createdDate

    }
    str += line + '\r\n';
    return str;
  }
}