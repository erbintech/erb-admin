import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { elementAt, map, Observable, startWith } from 'rxjs';
import { AdminPersonalLoanResponse } from 'src/app/shared/models/loans/adminPersonalLoanResponse';
import { LoanStatuses } from 'src/app/shared/models/loanStatus/loanStatuses';
import { Offer } from 'src/app/shared/models/offer';
import { Users } from 'src/app/shared/models/users/user';
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
import { LoanDetail } from 'src/app/shared/models/loanDetail';
import { BankService } from 'src/app/shared/services/bank.service';
import { Bank } from 'src/app/shared/models/bank';
import { RejectionReason } from 'src/app/shared/models/rejectionReason';
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
  selector: 'app-personal-loan',
  templateUrl: './personal-loan.component.html',
  styleUrls: ['./personal-loan.component.scss']
})

export class PersonalLoanComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public isAlert: boolean;
  public alertType: string;//["success","danger","warning"]
  public alertMessage: string;
  public token: string;
  public offerColumn = ['id', 'bankName', 'cibilScore', 'age', 'roi', 'tenure', 'workExperience', 'minimumIncome']
  public displayColumns = ["id", "Customer", "ContactNo", "Email", "LoanAmount", "Employment", "Income", "Status", "DSACode", "rmFullName", 'createdDate', "isDelete", "Action"];
  public personalLoans: AdminPersonalLoanResponse[] = new Array<AdminPersonalLoanResponse>();
  public personalLoan = new AdminPersonalLoanResponse();
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public rmError: boolean = false;
  public reasonError: boolean = false;
  public loanStatuses: LoanStatuses[] = new Array<LoanStatuses>();
  public selectedLoanStatuses = [];
  public selectedStatus: number = null;
  public selectedLoanStatus: number = null;
  public dateFrom: Date;
  public dateTo: Date;
  public alertClosed: boolean = false
  public title: string;
  public isAllowStatusChange: boolean = false;
  public rmUsers: Users[] = new Array<Users>();
  public selectedRM = [];
  // public selectedRM: Users;
  public myControl = new FormControl();
  public filteredOptions: Observable<Users[]>;
  public selectedCustomerLoanId: number;
  public assignedRM: any;
  public offers: Offer[] = new Array<Offer>();
  public loanOffers: LoanOffer[] = new Array<LoanOffer>();
  public isRmAssign: boolean;
  public isVerifyDocument: boolean;
  public isChangeStatus: boolean;
  public isGenerateOffer: boolean;
  public isOfferDialog: boolean;
  public isGenerateDetail: boolean;
  public isRejectionReason: boolean;
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
  public reason = new FormControl();
  public offerForm: FormGroup
  public isCheckEligibility: boolean
  public loanOffer = new LoanOffer();
  public isFlag: boolean = true;
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
  public loanDetailForm: FormGroup;
  public rejectReason = new FormControl();
  public reasonDescription = new FormControl();
  public reasons = [];
  public isAddMoreReason: boolean = false;
  public rejectionReason: RejectionReason;

  public userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public searchString: string

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private personalLoanService: PersonalLoanService,
    private loanStatusService: LoanStatusService,
    private paginationService: PaginationService,
    private usersService: UsersService,
    private router: Router,
    private toasterService: ToastrService,
    private bankService: BankService,
    private commissionService: CommissionService,
    public toggleMenuService: ToggleMenuService
  ) {

    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this.userPagePermission.findIndex(c => c.name == 'personal-loan');
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
    setTimeout(() => {
      this.alertClosed = true;
    }, 2000);
    this.token = sessionStorage.getItem("SessionToken");
    await this.getLoanStatuses();
    await this.setPage(1);
    await this.getRM();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.rmUsers.slice())),
    );
  }

  private _filter(name: string): Users[] {
    const filterValue = name.toLowerCase();

    return this.rmUsers.filter(option => option.fullName.toLowerCase().includes(filterValue));
  }

  displayFn(user: Users): string {

    return user?.fullName ? user.fullName : '';
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getPersonalLoans();
    }
  }

  public async getPersonalLoans() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.personalLoanService.getPersonalLoans(1, null, this.startIndex, this.fetchRecord, this.token, this.dateFrom, this.dateTo, this.selectedStatus, searchString);
      if (res && res.status == 200) {
        this.personalLoans = res.recordList;

        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
      }
      if (this.personalLoans.length > 0) {
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

  public async getRM() {
    try {
      this.rmUsers = new Array<Users>();
      let res = await this.usersService.getRM(0, 0, null, this.token);
      if (res && res.status == 200) {
        this.rmUsers = res.recordList;
        this.selectedRM = this.rmUsers;
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
      this.toasterService.error(this.alertMessage)

    }
  }

  public async clearSearch() {
    this.selectedStatus = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.searchString = null;
    await this.getPersonalLoans();
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
      this.toasterService.error(this.alertMessage)
    }
  }

  public viewDetail(obj: AdminPersonalLoanResponse) {
    this.router.navigate(["personal-loan/view/", obj.basicDetail.customerLoanId]);
  }

  public navigateViewDetail(ele: any) {
    this.router.navigate(['/customer/view', ele.basicDetail.employmentTypeId])
  }


  public navigateCustomerDetail(ele) {
    this.router.navigate(["customer/view", ele.basicDetail.customerId]);
  }

  public async filterLoans() {
    this.startIndex = 0;
    this.fetchRecord = this.take;
    await this.setPage(1);
  }


  public navigateEditLoanPage(customerloan: AdminPersonalLoanResponse) {
    let customerLoanId = sessionStorage.getItem("customerLoanId");
    if (customerLoanId)
      sessionStorage.removeItem("customerLoanId")
    let route = 'personal-loan' + '/edit/' + customerloan.basicDetail.customerId + "/" + customerloan.basicDetail.customerLoanId;
    this.router.navigate([route])
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.personalLoanService.getPersonalLoans(1, null, null, null, this.token, this.dateFrom, this.dateTo, this.selectedStatus, searchString);
      let personalLoans = [];
      if (res && res.status == 200) {
        personalLoans = res.recordList;

      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(personalLoans);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['Name', 'ContactNo', 'Email', 'LoanAmount', 'Employment', 'Monthly Salary', 'Status', 'FIle Source', 'Assigned RM', 'Request Date']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'PersonalLoan_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      let monthlySalary = array[j].basicDetail?.monthlyIncome ? array[j].basicDetail?.monthlyIncome.toFixed(2) : ''
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
      line += '\n' + (j + 1) + ',' + array[j].basicDetail?.fullName + "," + array[j].basicDetail.contactNo + "," + email + ',' + array[j].basicDetail.loanAmount + ',' + employmentType + ',' + monthlySalary + ',' + status + ',' + fileSource + ',' + rmFullName + ',' + createdDate

    }
    str += line + '\r\n';
    return str;
  }

  public warningAlert(personalLoan: AdminPersonalLoanResponse) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Delete this personalLoan Loan",
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
            this.getPersonalLoans();
            Swal.fire(
              'DELETE',
              'Successfully Deleted personal Loan',
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
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }
}