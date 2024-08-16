import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { elementAt, map, Observable, startWith } from 'rxjs';
import { AdminPersonalLoanDocumentResponse } from 'src/app/shared/models/loans/adminPersonalloanDocumentsResponse';
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
import { AdminHomeLoanResponse } from 'src/app/shared/models/loans/adminHomeLoanResponse';
import { HomeLoanService } from 'src/app/shared/services/homeLoan.service';
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
  selector: 'app-lap',
  templateUrl: './lap.component.html',
  styleUrls: ['./lap.component.scss']
})
export class LAPComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public isAlert: boolean;
  public alertType: string;//["success","danger","warning"]
  public alertMessage: string;
  public token: string;
  public offerColumn = ['id', 'bankName', 'cibilScore', 'age', 'roi', 'tenure', 'workExperience', 'minimumIncome', 'action']
  public displayColumns = ["id", "Customer", "ContactNo", "Email", "LoanAmount", "Employment", "Income", "Status", "DSACode", "rmFullName", 'createdDate', "isDelete", "Action"];
  public homeLoans: AdminHomeLoanResponse[] = new Array<AdminHomeLoanResponse>();
  public homeLoan = new AdminHomeLoanResponse();
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
  public myControl = new FormControl();
  public filteredOptions: Observable<Users[]>;
  public selectedCustomerLoanId: number;
  public assignedRM: any;
  public offers: Offer[] = new Array<Offer>();
  public isRmAssign: boolean;
  public isVerifyDocument: boolean;
  public isChangeStatus: boolean;
  public isGenerateOffer: boolean;
  public isOfferDialog: boolean;
  public isGenerateDetail: boolean;
  public isRejectionReason: boolean;
  public isFlag: boolean = true;
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
  public isCheckEligibility: boolean
  public loanOffer = new LoanOffer();
  public loanOffers: LoanOffer[] = new Array<LoanOffer>();
  public offerForm: FormGroup
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
  public searchString: string;

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private personalLoanService: PersonalLoanService,
    private loanStatusService: LoanStatusService,
    private paginationService: PaginationService,
    private usersService: UsersService,
    private router: Router,
    private toasterService: ToastrService,
    private bankService: BankService,
    private homeLoanService: HomeLoanService,
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
      let ind = this.userPagePermission.findIndex(c => c.name == 'LAP');
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

  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getHomeLoans();
    }
  }

  public async getHomeLoans() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null
      let res = await this.homeLoanService.getHomeLoans(9, null, this.startIndex, this.fetchRecord, this.token, this.dateFrom, this.dateTo, this.selectedStatus, searchString);
      if (res && res.status == 200) {
        this.homeLoans = res.recordList;

        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
      }
      if (this.homeLoans.length > 0) {
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
    await this.getHomeLoans();
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

  public warningAlert(personalLoan: AdminPersonalLoanResponse) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Delete this LAP",
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
            this.getHomeLoans();
            Swal.fire(
              'DELETE',
              'Successfully Deleted LAP',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
            // this.toastrService.success("LAP Deleted Successfully")
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

  public viewDetail(obj: AdminPersonalLoanResponse) {
    this.router.navigate(["LAP/view/", obj.basicDetail.customerLoanId]);
  }

  public async modalOpen(basicmodal: any, obj: AdminHomeLoanResponse, action: string) {
    this.isChangeStatus = false;
    this.isGenerateOffer = false;
    this.isRmAssign = false;
    this.isVerifyDocument = false;
    this.isGenerateDetail = false
    this.isRejectionReason = false;
    if (obj)
      this.selectedCustomerLoanId = obj.basicDetail.customerLoanId;
    this.isCheckEligibility = false;
    if (obj)
      this.homeLoan = obj;
    if (action == "assignRM") {
      this.title = "Assign RM"
      this.isRmAssign = true;
      let data = this.rmUsers.find(c => c.fullName == obj.basicDetail.rmFullName);
      if (data) {
        this.myControl.setValue(data.id);
      }
      else {
        this.myControl = new FormControl();
      }
      this.selectedRM = this.rmUsers;
    }
    if (action == "verifyDocument") {
      this.title = "Verify Document"
      if (this.homeLoan.loanDocuments && this.homeLoan.loanDocuments.length > 0) {
        for (let index = 0; index < this.homeLoan.loanDocuments.length; index++) {
          if (!this.homeLoan.loanDocuments[index].documentStatus || this.homeLoan.loanDocuments[index].documentStatus == "PENDING")
            this.homeLoan.loanDocuments[index].documentStatus = "REVIEW";
        }
        for (let index = 0; index < this.homeLoan.loanDocuments.length; index++) {
          if (this.homeLoan.loanDocuments[index].documentStatus == "REVIEW" || this.homeLoan.loanDocuments[index].documentStatus == "REJECTED") {
            this.isAllowStatusChange = false;
            break;
          }
        }
      }
      this.isVerifyDocument = true;
    }
    if (action == "checkEligibility") {
      this.title = "Check Eligibility"
      this.isCheckEligibility = true;
    }
    if (action == "generateOffer") {
      this.getBanks();
      this.isGenerateOffer = true;
      this.offerForm.reset();
      this.title = "Generate Offer";
      this.offerForm.get("loanAmount").setValue(obj.basicDetail.loanAmount)
    }
    if (action == "changeStatus") {
      if (this.selectedLoanStatus == 8 && obj == null) {
        this.loanDetail = new LoanDetail();
        this.loanDetailForm.reset();
        await this.getLoanOffer();
        this.loanOffers.forEach(ele => {
          this.loanDetailForm.get("ROI").setValue(ele.ROI)
          this.loanDetailForm.get("bankId").setValue(ele.bankId)
          this.loanDetailForm.get("amountDisbursed").setValue(ele.loanAmount)
          this.loanDetailForm.get("tenure").setValue(ele.tenure)
        })
        this.calculateEMI();
        this.isGenerateDetail = true;
        this.title = "Generate Detail"
        this.getBanks();
      }
      else if (obj != null) {
        this.title = "Change Status"
        this.selectedLoanStatus = null;
        this.getLoanStatuses();
        let selectedLoanStatuses = this.loanStatuses;
        if (obj.basicDetail.status) {
          selectedLoanStatuses.splice(0, selectedLoanStatuses.findIndex(c => c.status == obj.basicDetail.status))
        }

        this.selectedLoanStatuses = selectedLoanStatuses.filter(c => c.id == selectedLoanStatuses[1].id);
        if (this.selectedLoanStatuses[0].status == 'FILE APPROVED')
          this.selectedLoanStatuses.push(selectedLoanStatuses.filter(c => c.status == 'FILE DECLINE')[0])
        if (this.selectedLoanStatuses[0].status == 'FILE DECLINE')
          this.selectedLoanStatuses.push(selectedLoanStatuses.filter(c => c.status == 'SANCTIONED')[0])
        this.selectedLoanStatus = obj.basicDetail ? selectedLoanStatuses[1].id : null;
        this.isAllowStatusChange = true;
        this.isChangeStatus = true;
      }
      if (obj == null) {
        this.isChangeStatus = true;
      }
    }
    if (action == "generateDetail") {
      this.loanDetail = new LoanDetail();
      this.loanDetailForm.reset();
      await this.getLoanOffer();
      this.loanOffers.forEach(ele => {
        this.loanDetailForm.get("ROI").setValue(ele.ROI)
        this.loanDetailForm.get("bankId").setValue(ele.bankId)
        this.loanDetailForm.get("amountDisbursed").setValue(ele.loanAmount)
        this.loanDetailForm.get("tenure").setValue(ele.tenure)
      })
      this.calculateEMI();
      this.isGenerateDetail = true;
      this.title = "Generate Detail"
      this.getBanks();
    }
    if (action == "rejctionReason") {
      this.title = "Insert Rejection Reson"
      this.reasons = [];
      this.rejectionReason = null;
      this.isAddMoreReason = false;
      this.reason = new FormControl();
      this.reasonDescription = new FormControl();
      this.rejectReason = new FormControl();
      if (obj.basicDetail.status == "REJECTED") {
        await this.getCustomerLoanrejectionReason();
        if (this.rejectionReason) {
          this.reason.setValue(this.rejectionReason.reason)
          this.reasons = this.rejectionReason.reasons
        }
      }
      this.isRejectionReason = true;
    }
    if (obj)
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

  public async getBanks() {
    try {
      this.spinnerService.show();
      let res = await this.bankService.getBanks(null, null, null, this.token);
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
      this.toasterService.error(this.alertMessage)
    }
  }

  public async assignRM() {
    try {
      if (this.myControl.value) {
        let rmId = this.myControl.value
        let res = await this.personalLoanService.assignToRM(this.selectedCustomerLoanId, rmId, this.token);
        if (res && res.status == 200) {
          await this.getHomeLoans();
          this.modalService.dismissAll();
        }
      } else {
        this.alertMessage = "Relation Manager Selection in Required"
        this.isAlert = true;
        this.alertType = "danger";
        this.toasterService.warning(this.alertMessage)

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

  public cancelAssignRM() {
    this.modalService.dismissAll();
  }

  public async changeStatus() {
    try {
      if (this.selectedLoanStatus == 2) {
        if (!this.myControl.value) {
          this.rmError = true
        }
        else {
          this.assignRM()
        }
      }
      else {
        let res = await this.loanStatusService.changeLoanStatus(this.selectedCustomerLoanId, this.selectedLoanStatus, this.token);
        if (res && res.status == 200) {
          let index = this.homeLoans.findIndex(c => c.basicDetail.customerLoanId == this.selectedCustomerLoanId);
          this.homeLoans[index].basicDetail.statusId = res.recordList[0].statusId
          this.homeLoans[index].basicDetail.status = res.recordList[0].status

          this.modalService.dismissAll();
        }
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

  public isRmSelect() {
    if (this.myControl.value) {
      this.rmError = false;
    }
  }

  public navigateAddHomeLoan() {
    this.router.navigate(['LAP/add'])
  }

  public async getLoanOffer() {
    try {
      this.spinnerService.show();
      let res = await this.personalLoanService.getLoanOffer(this.selectedCustomerLoanId, this.token);
      if (res && res.status == 200) {
        this.loanOffers = res.recordList;
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

  public getStatus(e, doc: AdminPersonalLoanDocumentResponse) {
    let index = this.homeLoan.loanDocuments.findIndex(c => c.loanDocumentId == doc.loanDocumentId);
    this.homeLoan.loanDocuments[index].documentStatus = e.target.value;
  }

  public async addOfferForSend(share?: any) {
    try {
      this.spinnerService.show();
      let id = this.loanOffer.id ? this.loanOffer.id : null;
      this.loanOffer = this.offerForm.value;
      this.loanOffer.id = id
      this.loanOffer.isShared = share ? true : false;
      this.loanOffer.customerLoanId = this.selectedCustomerLoanId
      let res = await this.personalLoanService.insertLoanOffer(this.loanOffer, this.token);
      if (res && res.status == 200) {
        this.isGenerateOffer = false;
        this.homeLoans[this.homeLoans.findIndex(c => c.basicDetail.customerLoanId == this.selectedCustomerLoanId)].basicDetail.status = 'OFFER SELECTED'
        this.toasterService.success("You Successfully send the offer")
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
      this.toasterService.error(this.alertMessage)
    }
  }



  public openContentDialog(ele: Offer, offerModal: any) {
    this.htmlContent = null;
    this.offer = ele;
    this.isOfferDialog = true;
    if (ele.otherDetail) {
      this.htmlContent = ele.otherDetail
    }
    // this.modalService.open(offerModal, { size: 'lg' })
    this.modalService.open(offerModal, { size: 'lg', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public AddOfferContent() {
    this.offer.otherDetail = this.htmlContent;

  }

  public calculateEMI() {
    if (this.loanDetailForm.get("amountDisbursed").value && this.loanDetailForm.get("ROI").value && this.loanDetailForm.get("tenure").value) {
      let amount = this.loanDetailForm.get("amountDisbursed").value
      let rate = this.loanDetailForm.get("ROI").value / (12 * 100);
      let rate1 = (Math.pow(1 + rate, this.loanDetailForm.get("tenure").value))
      let payment = amount * rate * (rate1 / (rate1 - 1));
      this.emi = parseFloat(payment.toFixed(2));
      this.payment = parseFloat((parseFloat(payment.toFixed(2)) * this.loanDetailForm.get("tenure").value).toFixed(2));
      this.interest = parseFloat(((parseFloat(payment.toFixed(2)) * this.loanDetailForm.get("tenure").value) - this.loanDetailForm.get("amountDisbursed").value).toFixed(2));
      this.displayPayment = (parseFloat(payment.toFixed(2)) * this.loanDetailForm.get("tenure").value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.displayInterset = ((parseFloat(payment.toFixed(2)) * this.loanDetailForm.get("tenure").value - this.loanDetailForm.get("amountDisbursed").value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      let principalAmountPercent = ((amount * 100) / (parseFloat(payment.toFixed(2)) * this.loanDetailForm.get("tenure").value))
      let interestAmountPercent = (100 - principalAmountPercent)
      this.chartOptions.series = [principalAmountPercent, interestAmountPercent]
    }
  }

  public async insertLoanDetail(form) {
    try {
      if (form.valid) {
        this.loanDetail = new LoanDetail();
        this.spinnerService.show()
        this.loanDetail = this.loanDetailForm.value;
        this.loanDetail.customerLoanId = this.selectedCustomerLoanId;
        this.loanDetail.emi = this.emi;
        this.loanDetail.totalInterestPayable = this.interest
        let commissionResponse = await this.commissionService.getCommission(null, null, [this.loanDetailForm.get('bankId').value], [9], this.token);
        if (commissionResponse && commissionResponse.status == 200) {
          if (commissionResponse.recordList.length > 0) {
            let index = this.homeLoans.findIndex(c => c.basicDetail.customerLoanId == this.selectedCustomerLoanId)
            if (this.homeLoans[index].basicDetail.partnerId) {
              let partnerCommissionResponse = await this.commissionService.getPartnerCommission(null, null, null, this.loanDetailForm.get('bankId').value, 9, null, this.homeLoans[index].basicDetail.partnerId, this.token)
              if (partnerCommissionResponse && partnerCommissionResponse.status == 200) {
                if (partnerCommissionResponse.recordList.length > 0) {
                  let res = await this.personalLoanService.insertLoanDetail(this.loanDetail, this.token);
                  if (res && res.status == 200) {
                    let index = this.homeLoans.findIndex(c => c.basicDetail.customerLoanId == this.selectedCustomerLoanId);
                    if (index >= 0) {
                      this.homeLoans[index].basicDetail.statusId = res.recordList[0].statusId;
                      this.homeLoans[index].basicDetail.status = res.recordList[0].status;
                    }
                    this.modalService.dismissAll();
                  }
                }
                else {
                  Swal.fire({
                    type: 'warning',
                    text: "Please First Insert commission of Mortagage/LAP for " + this.banks.find(c => c.id == this.loanDetailForm.get('bankId').value).name + " for " + this.homeLoans[index].basicDetail.partnerFullName + "",
                  }
                  )
                  const modalContent = document.querySelector('.swal2-container');
                  sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                  this.modalService.dismissAll();
                }
              }
            }
            else {
              let res = await this.commissionService.getPartnerCommission(null, null, null, null, null, null, this.homeLoans[index].basicDetail.createdBy, this.token)
              if (res && res.status == 200) {
                let res = await this.personalLoanService.insertLoanDetail(this.loanDetail, this.token);
                if (res && res.status == 200) {
                  let index = this.homeLoans.findIndex(c => c.basicDetail.customerLoanId == this.selectedCustomerLoanId);
                  if (index >= 0) {
                    this.homeLoans[index].basicDetail.statusId = res.recordList[0].statusId;
                    this.homeLoans[index].basicDetail.status = res.recordList[0].status;
                  }
                  this.modalService.dismissAll();
                }
              }
            }
          } else {
            Swal.fire({
              type: 'warning',
              text: "Please First Insert commission of Mortagage/LAP for " + this.banks.find(c => c.id == this.loanDetailForm.get('bankId').value).name + " for admin",
            }
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
            this.modalService.dismissAll();
          }
        }
      }
      else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
      this.spinnerService.hide()
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

  public async selectedImage(e: any) {

    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        this.loanDetailForm.get('termsCondition').setValue(image)
        this.fileName = e.target.files[0].name
      }
    }
  }


  public openLoanRejectionModal(element: AdminHomeLoanResponse, basicmodal) {
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
        let res = await this.personalLoanService.insertRejectionReason(id, this.selectedCustomerLoanId, this.reason.value, this.reasons, this.token);
        if (res && res.status == 200) {
          let index = this.homeLoans.findIndex(c => c.basicDetail.customerLoanId == this.selectedCustomerLoanId);
          this.homeLoans[index].basicDetail.statusId = 14;
          this.homeLoans[index].basicDetail.status = "REJECTED";
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
        this.toasterService.error(this.alertMessage)
      }
    }
    else {
      this.reasonError = true
    }
  }

  public async getCustomerLoanrejectionReason() {
    try {
      let res = await this.personalLoanService.getCustomerLoanRejectionReason(this.selectedCustomerLoanId, this.token);
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
      this.toasterService.error(this.alertMessage)
    }
  }

  public removeReason(reason, index: number) {
    this.reasons.splice(index, 1);
  }

  public navigateCustomerDetail(ele) {
    this.router.navigate(["customer/view", ele.basicDetail.customerId]);
  }

  public async filterLoans() {
    this.startIndex = 0;
    this.fetchRecord = this.take;
    await this.setPage(1);
  }

  public navigateEditLoanPage(customerloan: AdminHomeLoanResponse) {
    let customerLoanId = sessionStorage.getItem("customerLoanId");
    if (customerLoanId)
      sessionStorage.removeItem("customerLoanId")
    let route = 'lap' + '/edit/' + customerloan.basicDetail.customerId + "/" + customerloan.basicDetail.customerLoanId;
    this.router.navigate([route])
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.homeLoanService.getHomeLoans(9, null, null, null, this.token, this.dateFrom, this.dateTo, this.selectedStatus, searchString);
      let homeLoans = [];
      if (res && res.status == 200) {
        homeLoans = res.recordList;
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(homeLoans);
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
    let fileName = 'LAP_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      let monthlySalary = array[j].basicDetail?.monthlyIncome ? array[j].basicDetail?.monthlyIncome.toFixed(2) : ''
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
      line += '\n' + (j + 1) + ',' + array[j].basicDetail?.fullName + "," + array[j].basicDetail.contactNo + "," + email + ',' + array[j].basicDetail.loanAmount + ',' + employmentType + ',' + monthlySalary + `,` + status + ',' + fileSource + ',' + rmFullName + ',' + createdDate

    }
    str += line + '\r\n';
    return str;
  }

}