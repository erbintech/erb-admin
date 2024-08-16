import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { Bank } from 'src/app/shared/models/bank';
import { CompanyName } from 'src/app/shared/models/companyName';
import { Customer } from 'src/app/shared/models/customer';
import { EmploymentType } from 'src/app/shared/models/employmentType';
import { AdminPersonalLoanResponse } from 'src/app/shared/models/loans/adminPersonalLoanResponse';
import { Maritalstatuses } from 'src/app/shared/models/maritalstatuses';
import { BankService } from 'src/app/shared/services/bank.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { DocumentService } from 'src/app/shared/services/document.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
import { MaritalStautusesService } from 'src/app/shared/services/maritalstatus.service';
import { PersonalLoanService } from 'src/app/shared/services/personalLoan.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
declare let require;
const Swal = require('sweetalert2')
@Component({
  selector: 'app-add-personal-loan',
  templateUrl: './add-personal-loan.component.html',
  styleUrls: ['./add-personal-loan.component.scss']
})
export class AddPersonalLoanComponent implements OnInit {
  public basicDetailForm: FormGroup;
  public employmentDetailForm: FormGroup;
  public refrenceForm: FormGroup;
  public token: string;
  public nameOfCompany: string;
  public maritalStatuses: Maritalstatuses[] = new Array<Maritalstatuses>();
  public alertMessage: string;
  public employmentTypes: EmploymentType[] = new Array<EmploymentType>();
  public personalLoan = new AdminPersonalLoanResponse();
  public companyTypes = [];
  public serviceDocuments = [];
  private customerId: number;
  public customer: Customer[] = new Array<Customer>();
  public cities = [];
  public currentCities = [];
  public officeCities = [];
  public firstCities = [];
  public secondCities = [];
  public tenures = [];
  public company = []
  public documents = [];
  public viewUrl: string
  public loanRefrences = [];
  public customerLoanId: number;
  public minDate = new Date();
  public birthDayError: boolean = false;
  public loanAmount = new FormControl(null, [Validators.required]);
  public serviceName: string;
  public customerLoanSpouseId: number
  public serviceId: number
  public searchString: string;
  public employmentType: number = null;
  public selectedEmploymentType = [];
  public currentAddressId: number;
  public experienceTime = new FormControl();
  public isDone = new FormControl();
  public isSelect: boolean;
  public employmentTypeId: number
  public serviceDocument = [];
  public companyCategory = [];
  private startIndex: number;
  public fetchRecord: number;
  public banks: Bank[] = new Array<Bank>();
  public isTransfer = new FormControl();
  // public moreEmploymentDet
  companyName: Observable<CompanyName[]>;


  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private personalLoanService: PersonalLoanService,
    private maritalStautusesService: MaritalStautusesService,
    private toastrService: ToastrService,
    private employmentTypeService: EmploymentTypeService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private dsaService: DsaService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private bankService: BankService,
    public toggleMenuService: ToggleMenuService

  ) {
    this.basicDetailForm = formBuilder.group({
      'fullName': [null, [Validators.required]],
      'birthdate': [null, [Validators.required]],
      'panCardNo': [null, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      'alternativeContactNo': [null, [Validators.required, Validators.minLength(10)]],
      'gender': [null, [Validators.required]],
      'maritalStatusId': [null, [Validators.required]],
      'motherName': [null, [Validators.required]],
      'fatherName': [null, [Validators.required]],
      "tenureId": [null, [Validators.required]],
      'spouseName': [null],
      // 'spouseContactNo': [null, [Validators.minLength(10)]],
      'loanAmount': [null, [Validators.required]],
      'label': [null, [Validators.required]],
      'addressLine1': [null, [Validators.required]],
      'addressLine2': [null],
      'pincode': [null, [Validators.required, Validators.minLength(6)]],
      'cityId': [null, [Validators.required]],
      'district': [null, [Validators.required]],
      'state': [null, [Validators.required]],
      'loanAmountTakenExisting': [null],
      'approxDate': [null],
      'approxCurrentEMI': [null],
      'bankId': [null],
      'topupAmount': [null],
    });
    this.employmentDetailForm = formBuilder.group({
      'employmentTypeId': [null, [Validators.required]],
      'monthlyIncome': [null, [Validators.min(15000)]],
      'companyName': [null, [Validators.required]],
      'pincode': [null, [Validators.required, Validators.minLength(6)]],
      'designation': [null, [Validators.required]],
      'companyTypeId': [null],
      'currentCompanyExperience': [null, [Validators.required]],
      'label': [null, [Validators.required]],
      'addressLine1': [null, [Validators.required]],
      'addressLine2': [null],
      'cityId': [null, [Validators.required]],
      'district': [null, [Validators.required]],
      'state': [null, [Validators.required]],
      'officeEmailId': [null, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")]]
    });
    this.refrenceForm = formBuilder.group({
      'firstRefrenceName': [null, [Validators.required]],
      'firstRefrenceContactNo': [null, [Validators.required, Validators.minLength(10)]],
      'secondRefrenceName': [null, [Validators.required]],
      'secondRefrenceContactNo': [null, [Validators.required, Validators.minLength(10)]],
      'firstLabel': [null, [Validators.required]],
      'firstAddressLine1': [null, [Validators.required]],
      'firstAddressLine2': [null],
      'firstPincode': [null, [Validators.required, Validators.minLength(6)]],
      'firstCityId': [null, [Validators.required]],
      'firstDistrict': [null, [Validators.required]],
      'firstState': [null, [Validators.required]],
      'secondLabel': [null, [Validators.required]],
      'secondAddressLine1': [null, [Validators.required]],
      'secondAddressLine2': [null],
      'secondPincode': [null, [Validators.required, Validators.minLength(6)]],
      'secondCityId': [null, [Validators.required]],
      'secondDistrict': [null, [Validators.required]],
      'secondState': [null, [Validators.required]],
    });
  }

  async ngOnInit() {
    this.isTransfer.setValue("New");
    this.route.params.subscribe(async (params) => {
      this.customerId = params['customerId'];
    });
    this.route.params.subscribe(async (params) => {
      this.customerLoanId = params['customerLoanId'];
    });
    this.route.params.subscribe(async (params) => {
      this.serviceName = params['serviceName'];
    });
    this.token = sessionStorage.getItem("SessionToken");
    this.nameOfCompany = localStorage.getItem("OrganizationName");
    if (this.customerLoanId) {
      await this.getPersonalLoans(this.customerLoanId)
    }
    else if (sessionStorage.getItem("customerLoanId")) {
      let customerLoanId = JSON.parse(sessionStorage.getItem("customerLoanId"))
      this.customerLoanId = customerLoanId
      this.getPersonalLoans(this.customerLoanId)
    }
    this.serviceId = this.serviceName == "personal-loan" ? 1 : 4
    await this.getMaritalStatuses();
    await this.getServiceEmploymentTypes();
    await this.getCompanyTypes();
    await this.getTenure();
    await this.getBanks();
    if (this.customerId) {
      await this.getCustomer()
    }
    this.experienceTime.setValue("Months")

  }

  public searchCompany(event) {

    this.companyCategory = (JSON.parse((localStorage.getItem("CompanyCategory"))) as any[]).filter(c => c.companyName.toLowerCase().includes((event.target.value).toLowerCase())).slice(0, 25);
  }

  public async getTenure() {
    try {
      this.spinnerService.show();
      let res = await this.personalLoanService.getTenure(this.token);
      if (res && res.status == 200) {
        this.tenures = res.recordList;

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

  public async getPersonalLoans(customerLoanId: number) {
    try {
      this.spinnerService.show();
      let res = await this.personalLoanService.getPersonalLoanById(customerLoanId, this.token);
      if (res && res.status == 200) {
        if (res.recordList && res.recordList.length > 0)
          this.personalLoan = res.recordList[0];
        this.getTenure();
        if (this.personalLoan) {
          if (this.personalLoan.basicDetail) {
            if (this.personalLoan.basicDetail.pincode)
              this.getCityByPincode(this.personalLoan.basicDetail.pincode, false, 'currentAddress');
            this.personalLoan.moreBasicDetail.spouseName = this.personalLoan.moreBasicDetail?.spouseName ? this.personalLoan.moreBasicDetail.spouseName : null;
            this.basicDetailForm.setValue({
              "fullName": this.personalLoan.basicDetail.fullName,
              "birthdate": this.formatDate(new Date(this.personalLoan.basicDetail.birthdate)),
              "panCardNo": this.personalLoan.basicDetail.panCardNo,
              "alternativeContactNo": this.personalLoan.moreBasicDetail.alternativeContactNo,
              'gender': this.personalLoan.moreBasicDetail.gender,
              'maritalStatusId': this.personalLoan.moreBasicDetail.maritalStatusId,
              'motherName': this.personalLoan.moreBasicDetail.motherName,
              'fatherName': this.personalLoan.moreBasicDetail.fatherName,
              'spouseName': this.personalLoan.moreBasicDetail?.spouseName ? this.personalLoan.moreBasicDetail.spouseName : null,
              // 'spouseContactNo': this.personalLoan.moreBasicDetail.spouseContactNo = this.personalLoan.moreBasicDetail.spouseContactNo ? this.personalLoan.moreBasicDetail.spouseContactNo : null,
              'loanAmount': this.personalLoan.basicDetail.loanAmount,
              'tenureId': this.personalLoan.basicDetail ? this.personalLoan.basicDetail.tenureId : null,
              'label': this.personalLoan.basicDetail ? this.personalLoan.basicDetail.label : null,
              'addressLine1': this.personalLoan.basicDetail ? this.personalLoan.basicDetail.addressLine1 : null,
              'addressLine2': this.personalLoan.basicDetail?.addressLine2 ? this.personalLoan.basicDetail.addressLine2 : null,
              'pincode': this.personalLoan.basicDetail && this.personalLoan.basicDetail.pincode != '' ? this.personalLoan.basicDetail.pincode : null,
              'cityId': this.personalLoan.basicDetail ? this.personalLoan.basicDetail.cityId : null,
              'district': this.personalLoan.basicDetail ? this.personalLoan.basicDetail.district : null,
              'state': this.personalLoan.basicDetail ? this.personalLoan.basicDetail.state : null,
              'loanAmountTakenExisting': this.personalLoan.moreBasicDetail.loanAmountTakenExisting,
              'approxCurrentEMI': this.personalLoan.moreBasicDetail.approxCurrentEMI,
              'approxDate': this.personalLoan.moreBasicDetail.approxDate,
              'bankId': this.personalLoan.moreBasicDetail.bankId,
              'topupAmount': this.personalLoan.moreBasicDetail.topupAmount,
            });
            if (this.personalLoan.moreBasicDetail.loanType == 'New') {
              this.isTransfer.setValue('New');
            } else {
              this.isTransfer.setValue('Bank Transfer');
            }
          }
          if (this.personalLoan.moreEmploymentDetail) {
            if (this.personalLoan.moreEmploymentDetail.pincode)
              this.getCityByPincode(this.personalLoan.moreEmploymentDetail.pincode, false, 'officeAddress');
            this.employmentDetailForm.setValue({
              'employmentTypeId': this.personalLoan.basicDetail.employmentTypeId,
              'monthlyIncome': this.personalLoan.basicDetail.monthlyIncome ? this.personalLoan.basicDetail.monthlyIncome : null,
              'companyName': this.personalLoan.basicDetail.companyName ? this.personalLoan.basicDetail.companyName : null,
              'pincode': this.personalLoan.moreEmploymentDetail?.pincode ? this.personalLoan.moreEmploymentDetail.pincode : null,
              'designation': this.personalLoan.moreEmploymentDetail ? this.personalLoan.moreEmploymentDetail.designation : null,
              'companyTypeId': this.personalLoan.moreEmploymentDetail ? this.personalLoan.moreEmploymentDetail.companyTypeId : null,
              'currentCompanyExperience': this.personalLoan.moreEmploymentDetail ? this.personalLoan.moreEmploymentDetail.currentCompanyExperience : null,
              'label': this.personalLoan.moreEmploymentDetail ? this.personalLoan.moreEmploymentDetail.label : null,
              'addressLine1': this.personalLoan.moreEmploymentDetail ? this.personalLoan.moreEmploymentDetail.addressLine1 : null,
              'addressLine2': this.personalLoan.moreEmploymentDetail?.pincode ? this.personalLoan.moreEmploymentDetail.addressLine2 : null,
              'cityId': this.personalLoan.moreEmploymentDetail ? this.personalLoan.moreEmploymentDetail.cityId : null,
              'district': this.personalLoan.moreEmploymentDetail ? this.personalLoan.moreEmploymentDetail.district : null,
              'state': this.personalLoan.moreEmploymentDetail ? this.personalLoan.moreEmploymentDetail.state : null,
              'officeEmailId': this.personalLoan.moreEmploymentDetail ? this.personalLoan.moreEmploymentDetail.emailId : null
            });
          }
          if (this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0) {
            this.getCityByPincode(this.personalLoan.loanReferences[0].pincode, false, 'firstReferenceAddress');
            this.getCityByPincode(this.personalLoan.loanReferences[1].pincode, false, 'secondReferenceAddress');
            this.refrenceForm.setValue({
              'firstRefrenceName': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].fullName : null,
              'firstRefrenceContactNo': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].contactNo : null,
              'firstLabel': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].label : null,
              'firstAddressLine1': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].addressLine1 : null,
              'firstAddressLine2': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].addressLine2 : null,
              'firstPincode': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].pincode : null,
              'firstCityId': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].cityId : null,
              'firstDistrict': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].district : null,
              'firstState': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].state : null,
              'secondRefrenceName': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].fullName : null,
              'secondRefrenceContactNo': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].contactNo : null,
              'secondLabel': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].label : null,
              'secondAddressLine1': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].addressLine1 : null,
              'secondAddressLine2': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].addressLine2 : null,
              'secondPincode': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].pincode : null,
              'secondCityId': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].cityId : null,
              'secondDistrict': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].district : null,
              'secondState': this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].state : null,
            })
          }

          this.loanAmount.setValue(this.personalLoan.basicDetail.loanAmount)
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

  public async getMaritalStatuses() {
    try {
      this.spinnerService.show();
      let res = await this.maritalStautusesService.getMaritalStatuses(null, this.token);
      if (res && res.status == 200) {
        this.maritalStatuses = res.recordList;
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

  public async getBanks() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.bankService.getBanks(this.startIndex, this.fetchRecord, searchString, this.token);
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

  public async getServiceEmploymentTypes() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getServiceEmploymentType(this.token, this.serviceId);
      if (res && res.status == 200) {
        this.employmentTypes = res.recordList;
        if (this.employmentTypes && this.employmentTypes.length > 0) {
          this.spinnerService.hide();
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

  public async addBasicDetail(form) {
    if (form.valid) {
      if (!this.birthDayError) {
        try {
          this.spinnerService.show();
          let basicDetail = this.basicDetailForm.value;
          basicDetail.serviceId = this.serviceName == "personal-loan" ? 1 : 4;
          basicDetail.customerLoanId = this.customerLoanId ? this.customerLoanId : null
          basicDetail.customerLoanSpouseId = this.customerLoanSpouseId ? this.personalLoan.moreBasicDetail.customerLoanSpouseId : (this.customerLoanSpouseId ? this.customerLoanSpouseId : null);
          basicDetail.customerId = this.customerId
          basicDetail.currentAddressId = this.personalLoan.basicDetail?.currentAddressId ? this.personalLoan.basicDetail.currentAddressId : (this.currentAddressId ? this.currentAddressId : null);
          basicDetail.city = this.currentCities[this.currentCities.findIndex(c => c.id == this.basicDetailForm.get('cityId').value)].name;
          basicDetail.tenure = this.tenures[this.tenures.findIndex(c => c.id == this.basicDetailForm.get('tenureId').value)].name;
          basicDetail.addressLine2 = this.basicDetailForm.get("addressLine2").value ? this.basicDetailForm.get("addressLine2").value : null;
          basicDetail.loanAmountTakenExisting = this.basicDetailForm.get("loanAmountTakenExisting").value ? this.basicDetailForm.get("loanAmountTakenExisting").value : null;
          basicDetail.approxDate = this.basicDetailForm.get("approxDate").value ? this.basicDetailForm.get("approxDate").value : null;
          basicDetail.approxCurrentEMI = this.basicDetailForm.get("approxCurrentEMI").value ? this.basicDetailForm.get("approxCurrentEMI").value : null;
          basicDetail.bankId = this.basicDetailForm.get("bankId").value ? this.basicDetailForm.get("bankId").value : null;
          basicDetail.topupAmount = this.basicDetailForm.get("topupAmount").value ? this.basicDetailForm.get("topupAmount").value : null;
          basicDetail.loanType = this.isTransfer.value;
          let res = await this.personalLoanService.insertPersonLoanBasicDetail(basicDetail, this.token);
          if (res && res.status == 200) {
            if (res.recordList && res.recordList.length > 0) {
              let customerLoanId = sessionStorage.getItem("customerLoanId");
              if (customerLoanId) {
                sessionStorage.removeItem("customerLoanId")
              }
              sessionStorage.setItem("customerLoanId", JSON.stringify(res.recordList[0].customerLoanId))
              this.customerLoanId = res.recordList[0].customerLoanId;
              this.customerLoanSpouseId = res.recordList[0].customerLoanspouseId > 0 ? res.recordList[0].customerLoanspouseId : null
              this.currentAddressId = res.recordList[0].currentAddressId ? res.recordList[0].currentAddressId : null
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
    }
    else {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  public async addEmploymentDetail(form) {
    if (form.valid) {
      try {
        this.spinnerService.show();
        let companyAddressId = this.personalLoan.moreEmploymentDetail?.companyAddressId ? this.personalLoan.moreEmploymentDetail.companyAddressId : null;
        this.personalLoan.moreEmploymentDetail = this.employmentDetailForm.value;
        this.personalLoan.moreEmploymentDetail.city = this.officeCities[this.officeCities.findIndex(c => c.id == this.employmentDetailForm.get('cityId').value)].name;
        this.personalLoan.moreEmploymentDetail.customerLoanId = this.customerLoanId;
        this.personalLoan.moreEmploymentDetail.customerLoanEmploymentId = this.personalLoan.basicDetail?.customerLoanEmploymentId ? this.personalLoan.basicDetail.customerLoanEmploymentId : null
        this.personalLoan.moreEmploymentDetail.customerId = this.customerId;
        this.personalLoan.moreEmploymentDetail.serviceId = this.serviceName == "personal-loan" ? 1 : 4;
        this.personalLoan.moreEmploymentDetail.companyAddressId = companyAddressId;
        if (this.experienceTime.value == 'Year') {
          this.personalLoan.moreEmploymentDetail.currentCompanyExperience = this.personalLoan.moreEmploymentDetail.currentCompanyExperience * 12;
        }
        this.personalLoan.moreEmploymentDetail.addressLine2 = this.employmentDetailForm.get("addressLine2").value ? this.employmentDetailForm.get("addressLine2").value : null
        let res = await this.personalLoanService.insertPersonLoanEmploymentDetail(this.personalLoan.moreEmploymentDetail, this.token);
        if (res && res.status == 200) {
          if (res.recordList && res.recordList.length > 0) {
            this.personalLoan.moreEmploymentDetail.customerLoanEmploymentId = res.recordList[0].customerLoanEmploymentId
            this.personalLoan.moreEmploymentDetail.companyAddressId = res.recordList[0].companyAddressId
            await this.getServiceDocument(this.employmentDetailForm.get('employmentTypeId').value);

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
    else {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  public async addPersonalLoanDocumentAndRefrences(form) {
    let documentError: boolean = false;
    if (form.valid) {
      this.isSelect = (this.isDone.value) ? true : false;
      if (this.isSelect) {
        try {

          this.loanRefrences = [];
          if (this.documents && this.documents.length > 0) {
            this.spinnerService.show();
            for (let index = 0; index < this.documents.length; index++) {
              if (!this.documents[index].documentData) {
                if (this.documents[index].isRequired) {
                  this.documents[index].documentError = true;
                  documentError = true;
                }
              }
              else {
                if (!this.documents[index].documentData.includes('https')) {
                  let docUrl = this.documents[index].documentData.split(',')[1];
                  this.documents[index].documentData = docUrl
                }
              }
            }
            if (!documentError) {
              let data = {
                "name": this.refrenceForm.get("firstRefrenceName").value,
                "contactNo": this.refrenceForm.get("firstRefrenceContactNo").value,
                "label": this.refrenceForm.get("firstLabel").value,
                "addressLine1": this.refrenceForm.get("firstAddressLine1").value,
                "addressLine2": this.refrenceForm.get("firstAddressLine2").value,
                "pincode": this.refrenceForm.get("firstPincode").value,
                "cityId": this.refrenceForm.get("firstCityId").value,
                "district": this.refrenceForm.get("firstDistrict").value,
                "state": this.refrenceForm.get("firstState").value,
                "loanReferenceId": this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[0].loanReferenceId : null
              }
              this.loanRefrences.push(data);
              let secondRefrenceData = {
                "name": this.refrenceForm.get("secondRefrenceName").value,
                "contactNo": this.refrenceForm.get("secondRefrenceContactNo").value,
                "Label": this.refrenceForm.get("secondLabel").value,
                "addressLine1": this.refrenceForm.get("secondAddressLine1").value,
                "addressLine2": this.refrenceForm.get("secondAddressLine2").value,
                "pincode": this.refrenceForm.get("secondPincode").value,
                "cityId": this.refrenceForm.get("secondCityId").value,
                "district": this.refrenceForm.get("secondDistrict").value,
                "state": this.refrenceForm.get("secondState").value,
                "loanReferenceId": this.personalLoan.loanReferences && this.personalLoan.loanReferences.length > 0 ? this.personalLoan.loanReferences[1].loanReferenceId : null
              }
              this.loanRefrences.push(secondRefrenceData);
              this.loanRefrences[0].city = this.firstCities[this.firstCities.findIndex(c => c.id == this.refrenceForm.get('firstCityId').value)].name;
              this.loanRefrences[1].city = this.secondCities[this.secondCities.findIndex(c => c.id == this.refrenceForm.get('secondCityId').value)].name;


              let res = await this.personalLoanService.insertPersonalLoanDocuments(this.documents, this.loanRefrences, this.customerLoanId, this.token);
              if (res && res.status == 200) {
                Swal.fire(
                  'Successfully Insert Loan',
                  'success'
                )
                const modalContent = document.querySelector('.swal2-container');
                sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                if (this.serviceName == 'personal-loan')
                  this.router.navigate(["/personal-loan"])
                else
                  this.router.navigate(["/instant-loan"])
              }
            }
          }
          else {
            this.toastrService.error("Please Upload Document And refrences")
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
    }
    else {
      if (this.documents && this.documents.length > 0) {

        for (let index = 0; index < this.documents.length; index++) {
          if (!this.documents[index].documentData) {
            if (this.documents[index].isRequired) {
              this.documents[index].documentError = true;
              documentError = true;
            }
          }
        }
      }
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  public async getCompanyTypes() {
    try {
      this.spinnerService.show();
      let res = await this.personalLoanService.getCompanyTypes(this.token);
      if (res && res.status == 200) {
        this.companyTypes = res.recordList;
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

  public async getServiceDocument(employmentTypeId: number) {
    try {
      this.documents = [];
      this.spinnerService.show();
      let serviceId = this.serviceName == "personal-loan" ? 1 : 4;
      let res = await this.documentService.getServiceDocument(null, null, serviceId, this.token);
      if (res && res.status == 200) {
        this.serviceDocuments = res.recordList;
        this.serviceDocuments = this.serviceDocuments.filter(c => c.employmentTypeId == employmentTypeId)
        if (this.serviceDocuments && this.serviceDocuments.length > 0) {
          if (!this.personalLoan.loanDocuments || this.personalLoan.loanDocuments.length == 0) {
            for (let index = 0; index < this.serviceDocuments.length; index++) {
              if (this.serviceDocuments[index].documentCount > 1) {
                for (let j = 0; j < this.serviceDocuments[index].documentCount; j++) {
                  let data = {
                    "documentName": this.serviceDocuments[index].documentName,
                    "count": j + 1,
                    "isRequired": this.serviceDocuments[index].isRequired,
                    "isPdf": this.serviceDocuments[index].isPdf,
                    "documentId": this.serviceDocuments[index].documentId,
                    "serviceTypeDocumentId": this.serviceDocuments[index].id,
                    "displayName": this.serviceDocuments[index].displayName,
                    "documentCount": this.serviceDocuments[index].documentCount,
                    "employmentTypeId": this.serviceDocuments[index].employmentTypeId,
                    "maxSize": this.serviceDocuments[index].maxSize
                  }
                  if (this.isTransfer.value == 'Bank Transfer') {
                    if (this.serviceDocuments[index].isRequiredForTransfer == 1) {
                      this.documents.push(data);
                    }
                  } else {
                    if (this.serviceDocuments[index].isRequiredForNew == 1) {
                      this.documents.push(data);
                    }
                  }
                }
              }
              else {
                let data = {
                  "documentName": this.serviceDocuments[index].documentName,
                  "isRequired": this.serviceDocuments[index].isRequired,
                  "isPdf": this.serviceDocuments[index].isPdf,
                  "documentId": this.serviceDocuments[index].documentId,
                  "serviceTypeDocumentId": this.serviceDocuments[index].id,
                  "displayName": this.serviceDocuments[index].displayName,
                  "documentCount": this.serviceDocuments[index].documentCount,
                  "employmentTypeId": this.serviceDocuments[index].employmentTypeId,
                  "maxSize": this.serviceDocuments[index].maxSize
                }
                if (this.isTransfer.value == 'Bank Transfer') {
                  if (this.serviceDocuments[index].isRequiredForTransfer == 1) {
                    this.documents.push(data);
                  }
                } else {
                  if (this.serviceDocuments[index].isRequiredForNew == 1) {
                    this.documents.push(data);
                  }
                }
              }
            }
          }
          else {
            for (let index = 0; index < this.serviceDocuments.length; index++) {
              if (this.serviceDocuments[index].documentCount > 1) {
                for (let j = 0; j < this.serviceDocuments[index].documentCount; j++) {
                  let documents = this.personalLoan.loanDocuments.filter(c => c.documentId == this.serviceDocuments[index].documentId);
                  let documentName = documents.length > 0 && documents[j]?.documentName ? documents[j]?.documentName : this.serviceDocuments[index].documentName
                  let loanDocumentId = documents.length > 0 && documents[j]?.loanDocumentId ? documents[j].loanDocumentId : null;
                  let documentData = documents.length > 0 && documents[j]?.documentUrl ? documents[j].documentUrl : null;
                  let data = {
                    "documentName": documentName,
                    "count": j + 1,
                    "documentId": this.serviceDocuments[index].documentId,
                    "loanDocumentId": loanDocumentId,
                    "documentData": documentData,
                    "employmentTypeId": this.serviceDocuments[index].employmentTypeId,
                    "displayName": this.serviceDocuments[index].displayName,
                    "isRequired": this.serviceDocuments[index].isRequired,
                    "isPdf": this.serviceDocuments[index].isPdf,
                    "serviceTypeDocumentId": this.serviceDocuments[index].id,
                    "documentCount": this.serviceDocuments[index].documentCount,
                    "maxSize": this.serviceDocuments[index].maxSize
                  }
                  if (this.isTransfer.value == 'Bank Transfer') {
                    if (this.serviceDocuments[index].isRequiredForTransfer == 1) {
                      this.documents.push(data);
                    }
                  } else {
                    if (this.serviceDocuments[index].isRequiredForNew == 1) {
                      this.documents.push(data);
                    }
                  }
                }
              }
              else {
                let i = this.personalLoan.loanDocuments.findIndex(c => c.documentId == this.serviceDocuments[index].documentId)
                let documentName = i >= 0 ? this.personalLoan.loanDocuments[i].documentName : this.serviceDocuments[index].documentName
                let loanDocumentId = i >= 0 ? this.personalLoan.loanDocuments[i].loanDocumentId : null;
                let documentData = i >= 0 ? this.personalLoan.loanDocuments[i].documentUrl : null;
                let data = {
                  "documentName": documentName,
                  "isRequired": this.serviceDocuments[index].isRequired,
                  "isPdf": this.serviceDocuments[index].isPdf,
                  "documentId": this.serviceDocuments[index].documentId,
                  "serviceTypeDocumentId": this.serviceDocuments[index].id,
                  "displayName": this.serviceDocuments[index].displayName,
                  "documentCount": this.serviceDocuments[index].documentCount,
                  "loanDocumentId": loanDocumentId,
                  "documentData": documentData,
                  "employmentTypeId": this.serviceDocuments[index].employmentTypeId,
                  "maxSize": this.serviceDocuments[index].maxSize
                }
                if (this.isTransfer.value == 'Bank Transfer') {
                  if (this.serviceDocuments[index].isRequiredForTransfer == 1) {
                    this.documents.push(data);
                  }
                } else {
                  if (this.serviceDocuments[index].isRequiredForNew == 1) {
                    this.documents.push(data);
                  }
                }
              }
            }
          }
          this.serviceDocument = this.documents
        }

        this.spinnerService.hide();
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

  public async getCustomer() {
    try {
      this.spinnerService.show();
      let res = await this.customerService.getCustomer(null, null, this.customerId, this.token);
      if (res && res.status == 200) {
        this.customer = res.recordList;
        this.basicDetailForm.get("fullName").setValue(this.customer[0].fullName ? this.customer[0].fullName : null)
        this.basicDetailForm.get("alternativeContactNo").setValue(this.customer[0].alternativeContactNo ? this.customer[0].alternativeContactNo : null)
        this.basicDetailForm.get("panCardNo").setValue(this.customer[0].panCardNo ? this.customer[0].panCardNo : null)
        this.basicDetailForm.get("birthdate").setValue(this.customer[0].birthdate ? this.formatDate(new Date(this.customer[0].birthdate)) : null)
        this.basicDetailForm.get("maritalStatusId").setValue(this.customer[0].maritalStatusId ? this.customer[0].maritalStatusId : null)
        this.basicDetailForm.get("gender").setValue(this.customer[0].gender ? this.customer[0].gender : null)
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

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  public counter(i: number) {
    return new Array(i);
  }

  public async onKeyUpEvent(event: any, ele: string, isChagneCityId) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, isChagneCityId, ele);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getCityByPincode(n, isChangeCityId, application?: any) {
    try {
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        if (application == 'currentAddress') {
          this.currentCities = res.recordList;
          if (this.currentCities && this.currentCities.length > 0) {
            this.basicDetailForm.get("district").setValue(this.currentCities[0].districtName)
            this.basicDetailForm.get("state").setValue(this.currentCities[0].stateName)
            if (isChangeCityId)
              this.basicDetailForm.get("cityId").setValue(this.currentCities[0].id)
          }
        }
        else if (application == "officeAddress") {
          this.officeCities = res.recordList
          if (this.officeCities && this.officeCities.length > 0) {
            this.employmentDetailForm.get("district").setValue(this.officeCities[0].districtName)
            this.employmentDetailForm.get("state").setValue(this.officeCities[0].stateName)
            if (isChangeCityId)
              this.employmentDetailForm.get("cityId").setValue(this.officeCities[0].id)
          }
        }
        else if (application == "firstReferenceAddress") {
          this.firstCities = res.recordList
          if (this.firstCities && this.firstCities.length > 0) {
            this.refrenceForm.get("firstDistrict").setValue(this.firstCities[0].districtName)
            this.refrenceForm.get("firstState").setValue(this.firstCities[0].stateName)
            if (isChangeCityId)
              this.refrenceForm.get("firstCityId").setValue(this.firstCities[0].id)
          }
        }
        else if (application == "secondReferenceAddress") {
          this.secondCities = res.recordList
          if (this.secondCities && this.secondCities.length > 0) {
            this.refrenceForm.get("secondDistrict").setValue(this.secondCities[0].districtName)
            this.refrenceForm.get("secondState").setValue(this.secondCities[0].stateName)
            if (isChangeCityId)
              this.refrenceForm.get("secondCityId").setValue(this.secondCities[0].id)
          }
        }
        else {
          this.cities = res.recordList;
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

  public selectedCity() {
    this.employmentDetailForm.get('district').setValue(this.officeCities[0].districtName);
    this.employmentDetailForm.get('state').setValue(this.officeCities[0].stateName);
  }

  public selectedCityBasicDetail() {
    this.basicDetailForm.get('district').setValue(this.currentCities[0].districtName);
    this.basicDetailForm.get('state').setValue(this.currentCities[0].stateName);
  }

  public selectedCityFirstReference() {
    this.refrenceForm.get('firstDistrict').setValue(this.firstCities[0].districtName);
    this.refrenceForm.get('firtState').setValue(this.firstCities[0].stateName);
  }

  public selectedCitySecondReference() {
    this.refrenceForm.get('secondDistrict').setValue(this.secondCities[0].districtName);
    this.refrenceForm.get('secondState').setValue(this.secondCities[0].stateName);
  }

  public viewFile(ele: AdminPersonalLoanResponse, i: number) {
    this.viewUrl = this.documents[i].documentData
  }

  public async selectedImage(e: any, ele: any, i: number) {

    const reader = new FileReader();
    if (e.target.files?.length) {
      if (e.target.files[0].size) {
        let size = ele.maxSize
        let fileSize = e.target.files[0].size * (0.001);
        if (fileSize > size) {
          this.toastrService.warning("File Size Should be less than " + ele.maxSize + "KB")
          this.documents[i].documentData = null
        }
        // ele.sizeError = "File Size Should be less than " + ele.maxSize + "KB"
        else {
          const [file] = e.target.files;
          reader.readAsDataURL(file);

          reader.onload = () => {
            let image = reader.result as string;
            this.documents[i].documentData = image
            this.documents[i].documentError = false;
          }
        }
      }
    }
  }

  private sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  public getAge() {
    let dt2 = new Date();
    let dt1 = this.basicDetailForm.get("birthdate").value;
    dt1 = new Date(dt1);
    let diffYear = (dt2.getTime() - dt1.getTime()) / 1000;
    diffYear /= (60 * 60 * 24);
    let age = Math.abs(Math.round(diffYear / 365.25));
    if (age <= 22) {
      this.birthDayError = true;
    }
    else
      this.birthDayError = false;
  }

  public async addLoanAmount() {
    if (this.loanAmount.value) {
      try {

        this.spinnerService.show();
        let res = await this.personalLoanService.updateLoanAmount(this.customerLoanId, this.loanAmount.value, this.token);
        if (res && res.status == 200) {
          Swal.fire(
            'Successfully Insert Loan',
            'success'
          )
          const modalContent = document.querySelector('.swal2-container');
          sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
          this.router.navigate(["/personal-loan"])
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
        this.toastrService.error(this.alertMessage);
      }
    }
    else {
      this.loanAmount.markAllAsTouched();
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


  public changeEmploymentType() {
    if (this.personalLoan.loanDocuments && this.personalLoan.loanDocuments.length > 0) {
      Swal.fire({
        title: 'Are you sure want to change employement type ?',
        text: "Once you change employement type,you have to again upload document according to your choosen employement type",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Change it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.spinnerService.show();
            let res = await this.personalLoanService.changeEmploymentType(this.customerLoanId, this.serviceId, this.token);
            if (res && res.status == 200) {
              this.spinnerService.hide();
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
          this.employmentDetailForm.get("employmentTypeId").setValue(this.personalLoan.moreEmploymentDetail.customerLoanEmploymentId)
        }
      })
      const modalContent = document.querySelector('.swal2-container');
      sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
    }
  }

  public changeLoanType() {
    if (this.personalLoan.loanDocuments && this.personalLoan.loanDocuments.length > 0) {
      Swal.fire({
        title: 'Are you sure want to change loan type?',
        text: "Once you change loan type,you have to again upload document according to your choosen loan type",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Change it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.spinnerService.show();
            this.personalLoan.moreBasicDetail.loanType = this.isTransfer.value;
            let res = await this.personalLoanService.changeLoanType(this.customerLoanId, this.serviceId, this.isTransfer.value, this.token);
            if (res && res.status == 200) {
              this.spinnerService.hide();
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
          this.isTransfer.setValue(this.personalLoan.moreBasicDetail.loanType);
        }
      })
      const modalContent = document.querySelector('.swal2-container');
      sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
    }
  }

  public debugBase64(base64URL) {
    let win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

}