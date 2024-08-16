import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminBusinessLoanResponse } from 'src/app/shared/models/loans/adminBusinessLoanResponse';
import { BusinessLoanService } from 'src/app/shared/services/businessLoan.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";
import { PersonalLoanService } from 'src/app/shared/services/personalLoan.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RejectionReason } from 'src/app/shared/models/rejectionReason';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { LoanStatusService } from 'src/app/shared/services/loanStatus.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/shared/services/users.service';
import { CommissionService } from 'src/app/shared/services/commissionType.service';
import { Users } from 'src/app/shared/models/users/user';
import { LoanDetail } from 'src/app/shared/models/loanDetail';
import { AdminPersonalLoanDocumentResponse } from 'src/app/shared/models/loans/adminPersonalloanDocumentsResponse';
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
  selector: 'app-business-loan-detail',
  templateUrl: './business-loan-detail.component.html',
  styleUrls: ['./business-loan-detail.component.scss']
})

export class BusinessLoanDetailComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public isAlert: boolean;
  public alertType: string;//["success","danger","warning"]
  public alertMessage: string;
  public token: string;
  public businessLoan: AdminBusinessLoanResponse = new AdminBusinessLoanResponse();;
  public offerColumn = ['id', 'bankName', 'cibilScore', 'age', 'roi', 'tenure', 'loanAmount', 'minimumIncome', 'fileStatus', 'action']
  public bankOfferColumn = ['id', 'bankName', 'referenceNo', 'amountDisbursed', 'roi', 'tenure', 'EMI', 'totalInterest', 'totalAmount', 'action']
  public displayPayment: string
  public displayInterest: string;
  public displayemi: string;
  public offers = [];
  public loanDetailForm: FormGroup;
  public emi: number;
  public interest: number;
  public displayInterset: string
  public payment: number;
  public fileName: string;
  public bankOffer;
  public banks = [];
  public bankOfferId: number
  public rejectionReason: RejectionReason;
  public rejectReason = new FormControl();
  public reasonDescription = new FormControl();
  public reasons = [];
  public isAddMoreReason: boolean = false;
  public title: string;
  public reason = new FormControl();
  public reasonError: boolean = false;
  public userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public selectedStatus: number;
  public loanStatuses = [];
  public rmUsers = [];
  public myControl = new FormControl();
  public rmError: boolean

  constructor(
    private spinnerService: NgxSpinnerService,
    private businessLoanService: BusinessLoanService,
    private route: ActivatedRoute,
    private personalLoanService: PersonalLoanService,
    private toastrService: ToastrService,
    private loanStatusService: LoanStatusService,
    private modalService: NgbModal,
    private usersService: UsersService,
    private commissionService: CommissionService,
    private formBuilder: FormBuilder,
    public toggleMenuService: ToggleMenuService
  ) {
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
    this.loanDetailForm = formBuilder.group({
      'refrenceNo': [null],
      'amountDisbursed': [null, [Validators.required]],
      'ROI': [null, [Validators.required]],
      'bankId': [null, [Validators.required]],
      'tenure': [null, [Validators.required]],
      'termsCondition': [null]
    });
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
    this.token = sessionStorage.getItem("SessionToken");
    this.route.params.subscribe(async (params) => {
      let customerLoanId = +params['id'];
      await this.getBusinessLoan(customerLoanId);
    });
    await this.getLoanStatuses();
    await this.getRM();
  }

  public async getBusinessLoan(customerLoanId: number) {
    try {
      this.spinnerService.show();
      let res = await this.businessLoanService.getBusinessLoanById(customerLoanId, this.token);
      if (res && res.status == 200) {
        if (res.recordList && res.recordList.length > 0)
          this.businessLoan = res.recordList[0];
        this.selectedStatus = this.businessLoan.basicDetail.statusId
        if (this.businessLoan?.disbursedData && this.businessLoan.disbursedData.length > 0) {
          for (let i = 0; i < this.businessLoan.disbursedData.length; i++) {
            let payment = (parseFloat(this.businessLoan.disbursedData[i].emi.toFixed(2)) * this.businessLoan.disbursedData[i].tenure + this.businessLoan.disbursedData[i].totalInterestPayable).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            this.businessLoan.disbursedData[i].totalPayment = payment
            let interest = this.businessLoan.disbursedData[i].totalInterestPayable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            this.businessLoan.disbursedData[i].totalInterest = interest
          }
          this.businessLoan.bankOffers = (this.businessLoan.disbursedData.filter((c) => c.status != ('SANCTIONED'))).filter(c => c.status != 'DISBURSED');
          this.businessLoan.sanctionedApplication = this.businessLoan.disbursedData.filter(c => c.status == 'SANCTIONED');

          this.businessLoan.disbursedApplication = this.businessLoan.disbursedData.filter(c => c.status == 'DISBURSED');

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

  private async getLoanStatuses() {
    try {
      let res = await this.loanStatusService.getLoanStatus(this.token);
      if (res && res.status == 200) {
        this.loanStatuses = res.recordList;
        if(this.businessLoan.basicDetail.status === 'DISBURSED') {
          this.loanStatuses = this.loanStatuses.filter(c => c.status != 'REJECTED').filter(c => c.status != 'DELETED').filter(c => c.status != 'DISBURSED').filter(c => c.status != 'SANCTIONED').filter(c => c.status != 'OFFER SELECTED')
        } else {
          this.loanStatuses = this.loanStatuses.filter(c => c.status != 'REJECTED').filter(c => c.status != 'DELETED').filter(c => c.status != 'DISBURSED').filter(c => c.status != 'SANCTIONED').filter(c => c.status != 'OFFER SELECTED').filter(c => c.status !='COMPLETED')
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public async approvedDocument(pendency?) {
    if (!pendency) {
      let isVerify: boolean = true;
      for (let i = 0; i < this.businessLoan.loanDocuments.length; i++) {
        if (this.businessLoan.loanDocuments[i].documentStatus != 'APPROVED') {
          this.toastrService.warning("First Approved All Document")
          isVerify = false
          return
        }
      }
      if (isVerify) {
        Swal.fire({
          title: 'Document',
          text: 'Are you sure you want to Verify all Documents',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes,Verify it!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              this.spinnerService.show();
              this.businessLoan.loanDocuments[0].customerLoanId = this.businessLoan.basicDetail.customerLoanId;
              let res = await this.personalLoanService.changeDocumentStatus(pendency, this.businessLoan.loanDocuments, this.token);
              if (res && res.status == 200) {
                this.businessLoan.loanDocuments = [...this.businessLoan.loanDocuments];
                if (res.recordList && res.recordList.length > 0) {
                  this.businessLoan.basicDetail.statusId = res.recordList[0].statusId
                  this.businessLoan.basicDetail.status = res.recordList[0].status;
                }
                Swal.fire(
                  'SUCCESS',
                  'Successfully Verify Document',
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
              this.toastrService.error(this.alertMessage)
            }
          }
        })
        const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
      }
    }
    else {

      Swal.fire({
        title: 'Document',
        text: 'Are you sure you want to generate document pendency?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Generate it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.spinnerService.show();
            this.businessLoan.loanDocuments[0].customerLoanId = this.businessLoan.basicDetail.customerLoanId;
            let res = await this.personalLoanService.changeDocumentStatus(pendency, this.businessLoan.loanDocuments, this.token);
            if (res && res.status == 200) {
              this.businessLoan.loanDocuments = [...this.businessLoan.loanDocuments];
              if (res.recordList && res.recordList.length > 0) {
                this.businessLoan.basicDetail.statusId = res.recordList[0].statusId
                this.businessLoan.basicDetail.status = res.recordList[0].status;
              }
              Swal.fire(
                'SUCCESS',
                'Successfully Generate Document Pendency',
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
            this.toastrService.error(this.alertMessage)
          }
        }
      })
      const modalContent = document.querySelector('.swal2-container');
      sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
    }
  }

  public changeStatus(basicmodal?: any) {
    if (this.selectedStatus == 2) {
      // this.modalService.open(basicmodal)
      this.modalService.open(basicmodal, {windowClass: 'custom-modal' });
      if (sessionStorage.getItem('dark-mode') == 'dark-only') {
        const modalContent = document.querySelector('.custom-modal .modal-content');
        modalContent.classList.add('dark-only-modal')
      }
      else {
        const modalContent = document.querySelector('.custom-modal .modal-content');
        modalContent.classList.remove('dark-only-modal')
      }
      let data = this.rmUsers.find(c => c.fullName == this.businessLoan.basicDetail.rmFullName);
      if (data) {
        this.myControl.setValue(data.id);
      }
      else {
        this.myControl = new FormControl();
      }
    }
    else {

      let status = this.loanStatuses.find(c => c.id == this.selectedStatus).status
      Swal.fire({
        title: 'Change Status',
        text: 'Are you sure you want to change Status to "' + status + '" of this Application?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Change it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let res = await this.loanStatusService.changeLoanStatus(this.businessLoan.basicDetail.customerLoanId, this.selectedStatus, this.token)
            if (res && res.status == 200) {
              this.businessLoan.basicDetail.status = status;
              this.businessLoan.basicDetail.statusId = this.selectedStatus
              Swal.fire(
                'SUCCESS',
                'Successfully Change Status',
                'success'
              )
              const modalContent = document.querySelector('.swal2-container');
              sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
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
  }

  public acceptApplication(status, basicmodal) {
    this.selectedStatus = status == 'ACCEPT' ? 17 : 14
    Swal.fire({
      title: 'Change Status',
      text: 'Are you sure you want to ' + status + '" this Application?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + status + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (status == 'ACCEPT') {
          try {
            let res = await this.loanStatusService.changeLoanStatus(this.businessLoan.basicDetail.customerLoanId, this.selectedStatus, this.token)
            if (res && res.status == 200) {
              this.businessLoan.basicDetail.status = status;
              this.businessLoan.basicDetail.statusId = this.selectedStatus
              this.spinnerService.hide();
              Swal.fire(
                'SUCCESS',
                'Successfully Accept Application',
                'success'
              )
              const modalContent = document.querySelector('.swal2-container');
              sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
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
        else {
          this.title = "Insert Rejection Reson"
          this.reasons = [];
          this.rejectionReason = null;
          this.isAddMoreReason = false;
          this.reason = new FormControl();
          this.reasonDescription = new FormControl();
          this.rejectReason = new FormControl();
          // this.modalService.open(basicmodal, { size: 'xl' });
          this.modalService.open(basicmodal, {size: 'xl',windowClass: 'custom-modal' });
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
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public async getRM() {
    try {
      this.rmUsers = new Array<Users>();
      let res = await this.usersService.getRM(0, 0, null, this.token);
      if (res && res.status == 200) {
        this.rmUsers = res.recordList;
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

  public isRmSelect() {
    if (this.myControl.value) {
      this.rmError = false;
    }
  }

  public async assignRM() {
    try {
      if (this.myControl.value) {
        let rmId = this.myControl.value
        let res = await this.personalLoanService.assignToRM(this.businessLoan.basicDetail.customerLoanId, rmId, this.token);
        if (res && res.status == 200) {
          this.businessLoan.basicDetail.status = 'RM ASSIGNED';
          this.businessLoan.basicDetail.statusId = 2;
          Swal.fire(
            'SUCCESS',
            'Successfully Assign RM',
            'success'
          )
          const modalContent = document.querySelector('.swal2-container');
          sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
          this.modalService.dismissAll();
        }
      } else {
        this.alertMessage = "Relation Manager Selection in Required"
        this.isAlert = true;
        this.alertType = "danger";
        this.toastrService.warning(this.alertMessage)
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

  public async getGeneratedOffer() {
    try {
      let dt2 = new Date();
      let dt1 = this.businessLoan.basicDetail.birthdate;
      dt1 = new Date(dt1);
      let diffYear = (dt2.getTime() - dt1.getTime()) / 1000;
      diffYear /= (60 * 60 * 24);
      let age = Math.abs(Math.round(diffYear / 365.25));
      let loanData = {
        "customerLoanId": this.businessLoan.basicDetail.customerLoanId,
        "employmentTypeId": null,
        "serviceId": 2,
        "age": age,
        "loanAmount": this.businessLoan.basicDetail.loanAmount,
        "companyName": this.businessLoan.basicDetail.companyName ? this.businessLoan.basicDetail.companyName : null,
        "cibilScore": this.businessLoan.basicDetail.cibilScore,
        "businessAnnualSale": this.businessLoan.basicDetail.businessAnnualSale,
        "minIncome": null,
        "vintage": this.businessLoan.moreBasicDetail.vintage,
      }
      let res = await this.personalLoanService.getGeneratedOffer(loanData, this.token);
      if (res && res.status == 200) {
        this.offers = res.recordList;
        if (this.offers && this.offers.length > 0) {
          this.offers.forEach(ele => {
            if (ele.status == 'ACCEPT')
              ele.isSelected = true;
            else
              ele.isSelected = false;
          })
          this.businessLoan.offers = this.offers
          this.businessLoan.offers = [...this.businessLoan.offers]
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public selectBank(event, ele) {
    if (event.target.checked) {
      this.businessLoan.offers.find(c => c.id == ele.id).isSelected = true
      this.businessLoan.offers.find(c => c.id == ele.id).status = 'ACCEPT'
    }
    else {
      this.businessLoan.offers.find(c => c.id == ele.id).isSelected = false
      this.businessLoan.offers.find(c => c.id == ele.id).status = 'REJECT'
    }
    this.businessLoan.offers = [...this.businessLoan.offers]
  }

  public async addBankForFileUpload() {
    try {
      this.spinnerService.show();
      let index = this.businessLoan.offers.findIndex(c => c.isSelected == true);
      if (index < 0) {
        this.toastrService.warning("Please Select At least one Bank");
      }
      else {
        let res = await this.personalLoanService.insertSelectedOffer(this.businessLoan.basicDetail.customerLoanId, this.businessLoan.offers, this.token)
        if (res && res.status == 200) {
          this.toastrService.success("SuccessFully Select Bank")
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

  public changeFileStatus(ele, status) {
    this.businessLoan.offers.find(c => c.id == ele.id).fileStatus = status
    this.businessLoan.offers = [...this.businessLoan.offers]
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
      this.displayPayment = (parseFloat(payment.toFixed(2)) * this.loanDetailForm.get("tenure").value + this.interest).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.displayInterset = ((parseFloat(payment.toFixed(2)) * this.loanDetailForm.get("tenure").value - this.loanDetailForm.get("amountDisbursed").value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      let principalAmountPercent = ((amount * 100) / (parseFloat(payment.toFixed(2)) * this.loanDetailForm.get("tenure").value))
      let interestAmountPercent = (100 - principalAmountPercent)
      this.chartOptions.series = [principalAmountPercent, interestAmountPercent]
    }
  }

  public async selectedImage(e: any) {

    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        this.loanDetailForm.get('termsCondition').setValue(image)
        this.fileName = e.target.files[0].name
      }
    }
  }

  public async addBankOfferInList(shared?) {
    if (this.loanDetailForm.valid) {
      if (this.businessLoan.bankOffers && this.businessLoan.bankOffers.length > 0) {
        let index = this.businessLoan.bankOffers.findIndex(c => c.id == this.bankOfferId)
        if (index >= 0) {
          this.businessLoan.bankOffers[index] = this.loanDetailForm.value;
          this.calculateEMI();
          this.businessLoan.bankOffers[index].emi = this.emi;
          this.businessLoan.bankOffers[index].totalInterest = this.displayInterset;
          this.businessLoan.bankOffers[index].totalPayment = this.displayPayment
          this.businessLoan.bankOffers[index].bankName = this.banks.find(c => c.id == this.loanDetailForm.get('bankId').value).name
          this.businessLoan.bankOffers[index].totalInterestPayable = this.interest
          this.bankOffer = this.businessLoan.bankOffers[index]
          this.bankOffer.id = this.bankOfferId
          if (this.bankOffer.termsCondition && !this.bankOffer.termsCondition.includes("https:")) {
            let terms = this.bankOffer.termsCondition.split(',')[1];
            this.bankOffer.termsCondition = terms
          }
        } else {
          let bankOffer = this.loanDetailForm.value;
          let bankOfferId = this.banks.find(c => c.id === bankOffer.bankId).bankOfferId
          bankOffer.bankOfferId = bankOfferId
          this.calculateEMI();
          bankOffer.emi = this.emi;
          bankOffer.totalInterest = this.displayInterset;
          bankOffer.totalPayment = this.displayPayment
          bankOffer.bankName = this.banks.find(c => c.id == this.loanDetailForm.get('bankId').value).name
          bankOffer.totalInterestPayable = this.interest
          this.bankOffer = bankOffer
          if (this.bankOffer.termsCondition && !this.bankOffer.termsCondition.includes("https:")) {
            let terms = this.bankOffer.termsCondition.split(',')[1];
            this.bankOffer.termsCondition = terms
          }
        }

      } else {
        let bankOffer = this.loanDetailForm.value;
        let bankOfferId = this.banks.find(c => c.id === bankOffer.bankId).bankOfferId
        bankOffer.bankOfferId = bankOfferId
        this.calculateEMI();
        bankOffer.emi = this.emi;
        bankOffer.totalInterest = this.displayInterset;
        bankOffer.totalPayment = this.displayPayment
        bankOffer.bankName = this.banks.find(c => c.id == this.loanDetailForm.get('bankId').value).name
        bankOffer.totalInterestPayable = this.interest
        this.bankOffer = bankOffer
        if (this.bankOffer.termsCondition && !this.bankOffer.termsCondition.includes("https:")) {
          let terms = this.bankOffer.termsCondition.split(',')[1];
          this.bankOffer.termsCondition = terms
        }
      } try {
        if (shared) {
          this.bankOffer.isShared = true;
        }
        this.bankOffer.customerLoanId = this.businessLoan.basicDetail.customerLoanId
        let res = await this.personalLoanService.insertLoanDetail(this.bankOffer, this.token)
        if (res && res.status == 200) {
          this.loanDetailForm.reset();

          this.bankOffer.termsCondition = res.recordList.termsCondition
          if (!this.businessLoan.bankOffers)
            this.businessLoan.bankOffers = [];
          if (this.bankOffer.id) {
            this.businessLoan.bankOffers[this.businessLoan.bankOffers.findIndex(c => c.id == this.bankOffer.id)] = this.bankOffer
          }
          else {
            this.bankOffer.id = res.recordList.id
            this.businessLoan.bankOffers.push(this.bankOffer)
          }
          this.businessLoan.bankOffers = [...this.businessLoan.bankOffers]
          this.banks.splice(this.banks.findIndex(c => c.id == this.bankOffer.bankId), 1)
          this.banks = [...this.banks]
          this.bankOfferId = null;
          if (!this.businessLoan.sanctionedApplication) {
            this.businessLoan.basicDetail.status = 'OFFER SELECTED'
            this.businessLoan.basicDetail.statusId = 13
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
        this.toastrService.error(this.alertMessage);
      }

    }
    else {
      Object.keys(this.loanDetailForm.controls).forEach(key => {
        this.loanDetailForm.controls[key].markAsTouched();
      });
    }
  }

  public getBank() {
    this.banks = [];
    if (this.businessLoan.offers && this.businessLoan.offers.length > 0) {
      for (let i = 0; i < this.businessLoan.offers.length; i++) {
        if (this.businessLoan.offers[i].fileStatus == 'FileApproved') {
          let data = {
            "id": this.businessLoan.offers[i].bankId,
            "name": this.businessLoan?.offers[i]?.bankName,
            "namedata": this.businessLoan?.offers[i]?.bankName + "-" + this.businessLoan?.offers[i]?.tenure
              + "-" + this.businessLoan?.offers[i]?.ROI + "%",
            "tenure": this.businessLoan?.offers[i]?.tenure,
            "roi": this.businessLoan?.offers[i]?.ROI,
            "bankOfferId": this.businessLoan?.offers[i]?.id
          }
          this.banks.push(data)
        }
      }
      if (this.banks && this.banks.length > 0) {
        if (this.businessLoan.bankOffers && this.businessLoan.bankOffers.length > 0) {
          let ids = [];
          this.businessLoan.bankOffers.forEach(ele => {
            ids.push(ele.bankId)
          });
          let bank = this.banks.filter((c) => ids.indexOf(c.id) == -1);
          this.banks = bank
        }
        if (this.businessLoan.sanctionedApplication && this.businessLoan.sanctionedApplication.length > 0) {
          let ids = [];
          this.businessLoan.sanctionedApplication.forEach(ele => {
            ids.push(ele.bankId)
          });
          let bank = this.banks.filter((c) => ids.indexOf(c.id) == -1);

          this.banks = bank
        }
        if (this.businessLoan.disbursedApplication && this.businessLoan.disbursedApplication.length > 0) {
          let ids = [];
          this.businessLoan.disbursedApplication.forEach(ele => {
            ids.push(ele.bankId)
          });
          let bank = this.banks.filter((c) => ids.indexOf(c.id) == -1);
          this.banks = bank
        }
      }
    }
    this.banks = [...this.banks]
  }

  public changeSelecedBank(event: any) {
    console.log(event);
    this.loanDetailForm.get('ROI').setValue(event.roi)
    this.loanDetailForm.get('tenure').setValue(event.tenure)
  }

  public acceptOffer(ele, isAccept, offerStatus?) {
    let accept = isAccept ? "Accept" : "Reject"
    Swal.fire({
      title: offerStatus == 'SANCTIONED' ? 'Are you sure want to ' + accept + 'Offer ?' : 'Are you sure want to  Disbursed Offer ?',
      text: isAccept && offerStatus == 'SANCTIONED' ? "Once you Accept Offer,Status will be change to SANCTIONED" : '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: !offerStatus || offerStatus != 'DISBURSED' ? 'Yes,' + accept + ' it!' : 'Yes, Disbursed it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let status = offerStatus ? offerStatus : null
          let res = await this.personalLoanService.acceptOffer(ele.id, isAccept, this.token, status, this.businessLoan.basicDetail.customerLoanId, ele.bankOfferId);
          if (res && res.status == 200) {
            this.businessLoan.bankOffers[this.businessLoan.bankOffers.findIndex(c => c.id == ele.id)].isAccept = isAccept;
            if (isAccept) {
              if (status == 'SANCTIONED') {
                this.businessLoan.bankOffers.splice(this.businessLoan.bankOffers.findIndex(c => c.id == ele.id), 1)
                if (!this.businessLoan.sanctionedApplication)
                  this.businessLoan.sanctionedApplication = [];
                this.businessLoan.sanctionedApplication.push(ele)
                this.businessLoan.sanctionedApplication = [...this.businessLoan.sanctionedApplication];
              }
              this.businessLoan.basicDetail.status = 'SANCTIONED'
              this.businessLoan.basicDetail.statusId = 7
              Swal.fire(
                'SUCCESS',
                'Successfully SANCTIONED Offer',
                'success'
              )
              const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
              this.businessLoan.basicDetail.status = 'SANCTIONED'
              this.businessLoan.basicDetail.statusId = 7
              this.businessLoan.bankOffers = [...this.businessLoan.bankOffers]
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
    })
    const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public async disbursedApplication(ele: LoanDetail) {
    try {
      ele.email = null;
      ele.termsCondition = null;
      ele.isAccept = true;
      ele.isActive = true;
      ele.isDelete = false;
      ele.isShared = ele.isShared ? true : false
      Swal.fire({
        title: 'Are you sure want to  Disbursed Offer ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Disbursed it'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let commissionResponse = await this.commissionService.getCommission(null, null, [ele.bankId], [2], this.token);
          if (commissionResponse && commissionResponse.status == 200) {
            if (commissionResponse.recordList.length > 0) {
              if (this.businessLoan.groupDetail) {
                if (this.businessLoan.groupDetail?.parentParentPartnerId) {
                  let parentParentPartnerCommissionResponse = await this.commissionService.getPartnerCommission(null, null, null, ele.bankId, 2, null, this.businessLoan.groupDetail.parentParentPartnerId, this.token)
                  if (parentParentPartnerCommissionResponse && parentParentPartnerCommissionResponse.status == 200) {
                    if (parentParentPartnerCommissionResponse.recordList.length > 0) {
                      let parentPartnerCommissionResponse = await this.commissionService.getPartnerCommission(null, null, null, ele.bankId, 2, null, this.businessLoan.groupDetail.parentPartnerId, this.token)
                      if (parentPartnerCommissionResponse && parentPartnerCommissionResponse.status == 200) {
                        if (parentPartnerCommissionResponse.recordList.length > 0) {
                          let partnerCommissionResponse = await this.commissionService.getPartnerCommission(null, null, null, ele.bankId, 2, null, this.businessLoan.groupDetail.id, this.token)
                          if (partnerCommissionResponse && partnerCommissionResponse.status == 200) {
                            if (partnerCommissionResponse.recordList.length > 0) {
                              ele.serviceId = 2;
                              let res = await this.personalLoanService.disbursedApplication(ele, this.token);
                              if (res && res.status == 200) {
                                this.businessLoan.sanctionedApplication.splice(this.businessLoan.sanctionedApplication.indexOf(ele.id), 1)
                                if (!this.businessLoan.disbursedApplication)
                                  this.businessLoan.disbursedApplication = [];
                                this.businessLoan.disbursedApplication.push(ele);
                                this.businessLoan.sanctionedApplication = [...this.businessLoan.sanctionedApplication];
                                this.businessLoan.disbursedApplication = [...this.businessLoan.disbursedApplication]
                                this.businessLoan.basicDetail.status = 'DISBURSED'
                                this.businessLoan.basicDetail.statusId = 8
                                Swal.fire(
                                  'SUCCESS',
                                  'Successfully DISBURSED Offer',
                                  'success'
                                )
                                const modalContent = document.querySelector('.swal2-container');
                                sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                              }
                            }
                            else {
                              Swal.fire({
                                type: 'warning',
                                text: "Please First Insert commission of BusinessLoan for " + ele.bankName + " for " + this.businessLoan.groupDetail.fullName + "",
                              })
                              const modalContent = document.querySelector('.swal2-container');
                              sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                            }
                          }
                        }
                        else {
                          Swal.fire({
                            type: 'warning',
                            text: "Please First Insert commission of BusinessLoan for " + ele.bankName + " for " + this.businessLoan.groupDetail.parentPartnerName + "",
                          })
                          const modalContent = document.querySelector('.swal2-container');
                          sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                        }
                      }
                    } else {
                      Swal.fire({
                        type: 'warning',
                        text: "Please First Insert commission of BusinessLoan for " + ele.bankName + " for " + this.businessLoan.groupDetail.parentParentPartnerName + "",
                      })
                      const modalContent = document.querySelector('.swal2-container');
                      sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                    }

                  }
                }
                else if (this.businessLoan.groupDetail?.parentPartnerId) {
                  let parentPartnerCommissionResponse = await this.commissionService.getPartnerCommission(null, null, null, ele.bankId, 2, null, this.businessLoan.groupDetail.parentPartnerId, this.token)
                  if (parentPartnerCommissionResponse && parentPartnerCommissionResponse.status == 200) {
                    if (parentPartnerCommissionResponse.recordList.length > 0) {
                      let partnerCommissionResponse = await this.commissionService.getPartnerCommission(null, null, null, ele.bankId, 2, null, this.businessLoan.groupDetail.id, this.token)
                      if (partnerCommissionResponse && partnerCommissionResponse.status == 200) {
                        if (partnerCommissionResponse.recordList.length > 0) {
                          ele.serviceId = 2;
                          let res = await this.personalLoanService.disbursedApplication(ele, this.token);
                          if (res && res.status == 200) {
                            this.businessLoan.sanctionedApplication.splice(this.businessLoan.sanctionedApplication.indexOf(ele.id), 1)
                            if (!this.businessLoan.disbursedApplication)
                              this.businessLoan.disbursedApplication = [];
                            this.businessLoan.disbursedApplication.push(ele);
                            this.businessLoan.sanctionedApplication = [...this.businessLoan.sanctionedApplication];
                            this.businessLoan.disbursedApplication = [...this.businessLoan.disbursedApplication]
                            this.businessLoan.basicDetail.status = 'DISBURSED'
                            this.businessLoan.basicDetail.statusId = 8
                            Swal.fire(
                              'SUCCESS',
                              'Successfully DISBURSED Offer',
                              'success'
                            )
                            const modalContent = document.querySelector('.swal2-container');
                            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                          }
                        }
                        else {
                          Swal.fire({
                            type: 'warning',
                            text: "Please First Insert commission of BusinessLoan for " + ele.bankName + " for " + this.businessLoan.groupDetail.fullName + "",
                          })
                          const modalContent = document.querySelector('.swal2-container');
                          sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                        }
                      }
                    }
                    else {
                      Swal.fire({
                        type: 'warning',
                        text: "Please First Insert commission of BusinessLoan for " + ele.bankName + " for " + this.businessLoan.groupDetail.parentPartnerName + "",
                      })
                      const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                    }
                  }
                }
                else if (this.businessLoan.groupDetail?.id) {
                  let partnerCommissionResponse = await this.commissionService.getPartnerCommission(null, null, null, ele.bankId, 2, null, this.businessLoan.groupDetail.id, this.token)
                  if (partnerCommissionResponse && partnerCommissionResponse.status == 200) {
                    if (partnerCommissionResponse.recordList.length > 0) {
                      ele.serviceId = 2
                      let res = await this.personalLoanService.disbursedApplication(ele, this.token);
                      if (res && res.status == 200) {
                        this.businessLoan.sanctionedApplication.splice(this.businessLoan.sanctionedApplication.indexOf(ele.id), 1)
                        if (!this.businessLoan.disbursedApplication)
                          this.businessLoan.disbursedApplication = [];
                        this.businessLoan.disbursedApplication.push(ele);
                        this.businessLoan.sanctionedApplication = [...this.businessLoan.sanctionedApplication];
                        this.businessLoan.disbursedApplication = [...this.businessLoan.disbursedApplication]
                        this.businessLoan.basicDetail.status = 'DISBURSED'
                        this.businessLoan.basicDetail.statusId = 8
                        Swal.fire(
                          'SUCCESS',
                          'Successfully DISBURSED Offer',
                          'success'
                        )
                        const modalContent = document.querySelector('.swal2-container');
                        sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                      }
                    }
                    else {
                      Swal.fire({
                        type: 'warning',
                        text: "Please First Insert commission of BusinessLoan for " + ele.bankName + " for " + this.businessLoan.groupDetail.fullName + "",
                      })
                      const modalContent = document.querySelector('.swal2-container');
                      sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                    }
                  }
                }
              } else {
                ele.serviceId = 2
                let res = await this.personalLoanService.disbursedApplication(ele, this.token);
                if (res && res.status == 200) {
                  this.businessLoan.sanctionedApplication.splice(this.businessLoan.sanctionedApplication.indexOf(ele.id), 1)
                  if (!this.businessLoan.disbursedApplication)
                    this.businessLoan.disbursedApplication = [];
                  this.businessLoan.disbursedApplication.push(ele);
                  this.businessLoan.sanctionedApplication = [...this.businessLoan.sanctionedApplication];
                  this.businessLoan.disbursedApplication = [...this.businessLoan.disbursedApplication]
                  this.businessLoan.basicDetail.status = 'DISBURSED'
                  this.businessLoan.basicDetail.statusId = 8
                  Swal.fire(
                    'SUCCESS',
                    'Successfully DISBURSED Offer',
                    'success'
                  )
                  const modalContent = document.querySelector('.swal2-container');
                  sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                }
              }
            } else {
              Swal.fire({
                type: 'warning',
                text: "Please First Insert commission of BusinessLoan for " + ele.bankName + " for admin",
              }
              )
              const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
            }
          }
        }
      })
      const modalContent = document.querySelector('.swal2-container');
      sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')

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

  public editBankOffer(ele) {
    let data = {
      "id": ele.bankId,
      "namedata": ele.bankName + "-" + ele.tenure + "-" + ele.ROI + "%",
      "name": ele.bankName,
      "tenure": ele.tenure,
      "roi": ele.ROI,
      "bankOfferId": ele.customerloanoffersId
    }
    this.banks.push(data)
    this.banks = [...this.banks]
    this.loanDetailForm.reset();
    this.loanDetailForm.setValue({
      "bankId": ele.bankId,
      "ROI": ele.ROI,
      "tenure": ele.tenure,
      "refrenceNo": ele.refrenceNo ? ele.refrenceNo : null,
      "amountDisbursed": ele.amountDisbursed,
      'termsCondition': ele.termsCondition ? ele.termsCondition : null
    })
    this.bankOfferId = ele.id
  }

  public showChart(ele, chartmodal) {
    let amount = ele.amountDisbursed
    let rate = ele.ROI / (12 * 100);
    let rate1 = (Math.pow(1 + rate, ele.tenure))
    let payment = amount * rate * (rate1 / (rate1 - 1));
    let principalAmountPercent = ((amount * 100) / (parseFloat(payment.toFixed(2)) * ele.tenure))
    let interestAmountPercent = (100 - principalAmountPercent)
    this.chartOptions.series = [principalAmountPercent, interestAmountPercent]
    // this.modalService.open(chartmodal)
    this.modalService.open(chartmodal, {windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public getSanctionedApplication() {
    if (this.businessLoan.sanctionedApplication && this.businessLoan.sanctionedApplication.length > 0) {
      for (let i = 0; i < this.businessLoan.sanctionedApplication.length; i++) {
        this.businessLoan.sanctionedApplication[i].totalPayment = (this.businessLoan.sanctionedApplication[i].emi * this.businessLoan.sanctionedApplication[i].tenure).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.businessLoan.sanctionedApplication[i].totalInterest = (this.businessLoan.sanctionedApplication[i].totalInterestPayable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        this.businessLoan.sanctionedApplication[i].displayemi = (this.businessLoan.sanctionedApplication[i].emi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }
    }
  }

  public getDisbursedApplication() {
    if (this.businessLoan.disbursedApplication && this.businessLoan.disbursedApplication.length > 0) {
      for (let i = 0; i < this.businessLoan.disbursedApplication.length; i++) {
        this.businessLoan.disbursedApplication[i].totalPayment = (this.businessLoan.disbursedApplication[i].emi * this.businessLoan.disbursedApplication[i].tenure + this.businessLoan.disbursedApplication[i].totalInterestPayable).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.businessLoan.disbursedApplication[i].totalInterest = (this.businessLoan.disbursedApplication[i].totalInterestPayable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        this.businessLoan.disbursedApplication[i].displayemi = (this.businessLoan.disbursedApplication[i].emi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }
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

  public removeReason(reason, index: number) {
    this.reasons.splice(index, 1);
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
        let res = await this.personalLoanService.insertRejectionReason(id, this.businessLoan.basicDetail.customerLoanId, this.reason.value, this.reasons, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.businessLoan.basicDetail.status = 'REJECTED'
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

  public getStatus(e, doc: AdminPersonalLoanDocumentResponse) {
    let index = this.businessLoan.loanDocuments.findIndex(c => c.loanDocumentId == doc.loanDocumentId);
    this.businessLoan.loanDocuments[index].documentStatus = e.target.value;
  }

  public debugBase64(base64URL) {
    let win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }
}