import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/shared/models/bank';
import { BusinessAnnualProfit } from 'src/app/shared/models/business-annual-profit';
import { BusinessExperience } from 'src/app/shared/models/business-experience';
import { BusinessNature } from 'src/app/shared/models/business-nature';
import { Customer } from 'src/app/shared/models/customer';
import { EmploymentType } from 'src/app/shared/models/employmentType';
import { IndustryType } from 'src/app/shared/models/industry-type';
import { LoanAgainstCollteral } from 'src/app/shared/models/loan-against-collteral';
import { AdminBusinessLoanResponse } from 'src/app/shared/models/loans/adminBusinessLoanResponse';
import { ResidenceType } from 'src/app/shared/models/residence-type';
import { BankService } from 'src/app/shared/services/bank.service';
import { BusinessAnnualProfitService } from 'src/app/shared/services/business-annual-profit.service';
import { BusinessExperienceService } from 'src/app/shared/services/business-experience.service';
import { BusinessNatureService } from 'src/app/shared/services/business-nature.service';
import { BusinessLoanService } from 'src/app/shared/services/businessLoan.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { DocumentService } from 'src/app/shared/services/document.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
import { IndustrytTypeService } from 'src/app/shared/services/industry-type.service';
import { LoanAgainstCollteralService } from 'src/app/shared/services/loan-against-collteral.service';
import { MaritalStautusesService } from 'src/app/shared/services/maritalstatus.service';
import { PersonalLoanService } from 'src/app/shared/services/personalLoan.service';
import { ResidenceTypeService } from 'src/app/shared/services/residence-type.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-add-business-loan',
  templateUrl: './add-business-loan.component.html',
  styleUrls: ['./add-business-loan.component.scss']
})
export class AddBusinessLoanComponent implements OnInit {
  firstFormGroup = this.formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  public basicDetailForm: FormGroup;
  public companyDetailForm: FormGroup;
  public token: string;
  public businessExperiences: BusinessExperience[] = new Array<BusinessExperience>();
  public businessLoan = new AdminBusinessLoanResponse();
  public alertMessage: string;
  public employmentTypes: EmploymentType[] = new Array<EmploymentType>();
  public residenceTypes: ResidenceType[] = new Array<ResidenceType>();
  public loanAgainstCollterals: LoanAgainstCollteral[] = new Array<LoanAgainstCollteral>();
  public cities = [];
  public minDate = new Date();
  public birthDayError: boolean = false;
  public maritalStatuses = [];
  public customerLoanId: number;
  public serviceDocuments = [];
  private customerId: number;
  public documents = [];
  public businessNatures: BusinessNature[] = new Array<BusinessNature>();
  public industryTypes: IndustryType[] = new Array<IndustryType>();
  public businessAnnualProfits: BusinessAnnualProfit[] = new Array<BusinessAnnualProfit>();
  public banks: Bank[] = new Array<Bank>();
  public companyTypes = [];
  public customerAddressId: number
  public customerLoanBusinessDetailId: number;
  public customerLoanCurrentResidentTypeId: number;
  public customer: Customer[] = new Array<Customer>();
  public isDone = new FormControl();
  public isSelect: boolean;
  public isTransfer = new FormControl();


  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private maritalStautusesService: MaritalStautusesService,
    private toastrService: ToastrService,
    private employmentTypeService: EmploymentTypeService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private dsaService: DsaService,
    private router: Router,
    private businessExperienceService: BusinessExperienceService,
    private residenceTypeService: ResidenceTypeService,
    private loanAgainstCollteralService: LoanAgainstCollteralService,
    private businessLoanService: BusinessLoanService,
    private businessNatureService: BusinessNatureService,
    private industryTypeService: IndustrytTypeService,
    private businessAnnualProfitService: BusinessAnnualProfitService,
    private bankService: BankService,
    private personalLoanService: PersonalLoanService,
    public toggleMenuService: ToggleMenuService
  ) {
    this.basicDetailForm = formBuilder.group({
      'loanAmount': [null, [Validators.required]],
      'fullName': [null, [Validators.required]],
      'birthdate': [null, [Validators.required]],
      'panCardNo': [null, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      'email': [null, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")]],
      'gender': [null, [Validators.required]],
      'maritalStatusId': [null, [Validators.required]],
      'employmentTypeId': [null, [Validators.required]],
      'businessAnnualSale': [null, [Validators.required]],
      'businessExperienceId': [null, [Validators.required]],
      'residentTypeId': [null, [Validators.required]],
      'loanAgainstCollateralId': [null],
      'pincode': [null, [Validators.required]],
      'cityId': [null, [Validators.required]],
      'addressLine1': [null, [Validators.required]],
      'addressLine2': [null],
      'loanAmountTakenExisting': [null],
      'approxDate': [null],
      'approxCurrentEMI': [null],
      'bankId': [null],
      'topupAmount': [null],
    });
    this.companyDetailForm = formBuilder.group({
      "companyTypeId": [null, [Validators.required]],
      "businessNatureId": [null, [Validators.required]],
      "industryTypeId": [null, [Validators.required]],
      "businessAnnualProfitId": [null, [Validators.required]],
      "primaryBankId": [null, [Validators.required]],
      "currentlyPayEmi": [null],
      "businessName": [null, [Validators.required]],
      "businessGstNo": [null, [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]]
    })

  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    this.isTransfer.setValue("New");
    this.route.params.subscribe(async (params) => {
      this.customerId = params['customerId'];
    });
    this.route.params.subscribe(async (params) => {
      this.customerLoanId = params['customerLoanId'];
    });
    if (this.customerLoanId) {
      this.getBusinessLoan(this.customerLoanId)
    }
    else if (sessionStorage.getItem("customerLoanId")) {
      let customerLoanId = JSON.parse(JSON.stringify(sessionStorage.getItem("customerLoanId")))
      this.customerLoanId = customerLoanId
      this.getBusinessLoan(this.customerLoanId)
    }
    this.isTransfer.setValue("New");
    await this.getBusinessExperience();
    await this.getServiceEmploymentType();
    await this.getMaritalStatuses();
    await this.getBusinessNature();
    await this.getResidentTypes();
    await this.getBusinessAnnualProfits();
    await this.getBanks();
    await this.getIndustryTypes();
    await this.getCompanyType();
    if (this.customerId) {
      await this.getCustomer()
    }
  }


  public async getBusinessExperience() {
    try {
      this.spinnerService.show();
      let res = await this.businessExperienceService.getBusinessExperience(null, null, this.token);
      if (res && res.status == 200) {
        this.businessExperiences = res.recordList;
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

  public async getServiceEmploymentType() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getServiceEmploymentType(this.token, 2);
      if (res && res.status == 200) {
        this.employmentTypes = res.recordList;
        this.employmentTypes = this.employmentTypes.filter(c => c.isParent != true);
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

  public async getResidentTypes() {
    try {
      this.spinnerService.show();
      let res = await this.residenceTypeService.getResidentTypes(null, null, this.token);
      if (res && res.status == 200) {
        this.residenceTypes = res.recordList;
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

  public async onKeyUpEvent(event: any, isChangeCity) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, isChangeCity);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getCityByPincode(n, isChangeCity) {
    try {
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        this.cities = res.recordList;
        if (this.cities && this.cities.length > 0)
          if (isChangeCity) {
            this.basicDetailForm.get("cityId").setValue(this.cities[0].id)
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

  public getAge() {
    let dt2 = new Date();
    let dt1 = this.basicDetailForm.get("birthdate").value;
    dt1 = new Date(dt1);
    let diffYear = (dt2.getTime() - dt1.getTime()) / 1000;
    diffYear /= (60 * 60 * 24);
    let age = Math.abs(Math.round(diffYear / 365.25));
    if (age <= 22) {
      this.basicDetailForm.get('birthdate').setErrors({ minAge: true })
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

  public async getServiceDocument(employmentTypeId: number) {
    try {
      this.spinnerService.show();
      let serviceId = 2;
      this.documents = [];
      let res = await this.documentService.getServiceDocument(null, null, serviceId, this.token);
      if (res && res.status == 200) {
        this.serviceDocuments = res.recordList;
        this.serviceDocuments = this.serviceDocuments.filter(c => c.employmentTypeId == employmentTypeId)
        if (this.serviceDocuments && this.serviceDocuments.length > 0) {
          if (!this.businessLoan.loanDocuments || this.businessLoan.loanDocuments.length == 0) {
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
                  let documents = this.businessLoan.loanDocuments.filter(c => c.documentId == this.serviceDocuments[index].documentId);
                  let documentName = documents.length > 0 && documents[j]?.documentName ? documents[j]?.documentName : this.serviceDocuments[index].documentName
                  let loanDocumentId = documents.length > 0 && documents[j]?.loanDocumentId ? documents[j].loanDocumentId : null;
                  let documentData = documents.length > 0 && documents[j]?.documentUrl ? documents[j].documentUrl : null;
                  let data = {
                    "documentName": documentName,
                    "count": j + 1,
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
              else {
                let i = this.businessLoan.loanDocuments.findIndex(c => c.documentId == this.serviceDocuments[index].documentId)
                let documentName = i >= 0 ? this.businessLoan.loanDocuments[i].documentName : this.serviceDocuments[index].documentName
                let loanDocumentId = i >= 0 ? this.businessLoan.loanDocuments[i].loanDocumentId : null;
                let documentData = i >= 0 ? this.businessLoan.loanDocuments[i].documentUrl : null;
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

  public async getBusinessNature() {
    try {
      this.spinnerService.show();
      let res = await this.businessNatureService.getBusinessNature(null, null, this.token);
      if (res && res.status == 200) {
        this.businessNatures = res.recordList;
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

  public async getIndustryTypes() {
    try {
      this.spinnerService.show();
      let res = await this.industryTypeService.getIndustryTypes(this.token);
      if (res && res.status == 200) {
        this.industryTypes = res.recordList;
        if (this.industryTypes && this.industryTypes.length > 0) {
          this.industryTypes.forEach(ele => {
            if (ele.parentId) {
              let index = this.industryTypes.findIndex(c => c.id == ele.parentId);
              ele.parentName = this.industryTypes[index].name;
              this.industryTypes[index].isParent = true;
            }
          });
        }
        this.industryTypes = this.industryTypes.filter(c => c.isParent != true);

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

  public async getBusinessAnnualProfits() {
    try {
      this.spinnerService.show();
      let res = await this.businessAnnualProfitService.getBusinessAnnualProfits(null, null, this.token);
      if (res && res.status == 200) {
        this.businessAnnualProfits = res.recordList;
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public async getCompanyType() {
    try {
      this.spinnerService.show();
      let res = await this.businessLoanService.getCompanyTypes(this.token);
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

  public async addBasicDetail(form) {
    if (form.valid) {
      try {
        this.spinnerService.show();
        let basicDetail = this.basicDetailForm.value;
        basicDetail.serviceId = 2;
        basicDetail.customerLoanId = this.customerLoanId ? this.customerLoanId : null
        basicDetail.customerAddressId = this.customer[0].customerAddressId ? this.customer[0].customerAddressId : null;
        basicDetail.customerLoanCurrentResidentTypeId = this.customerLoanCurrentResidentTypeId ? this.customerLoanCurrentResidentTypeId : null;
        basicDetail.customerLoanBusinessDetailId = this.businessLoan.basicDetail?.customerLoanBusinessDetailId ? this.businessLoan.basicDetail.customerLoanBusinessDetailId : null
        basicDetail.customerId = this.customerId
        basicDetail.district = this.cities[0].districtName;
        basicDetail.state = this.cities[0].stateName;
        basicDetail.addressLine2 = this.basicDetailForm.get("addressLine2").value ? this.basicDetailForm.get("addressLine2").value : null;
        basicDetail.city = this.cities[this.cities.findIndex(c => c.id == this.basicDetailForm.get('cityId').value)].name;
        basicDetail.userId = this.customer[0].userId
        basicDetail.loanAmountTakenExisting = this.basicDetailForm.get("loanAmountTakenExisting").value ? this.basicDetailForm.get("loanAmountTakenExisting").value : null;
        basicDetail.approxDate = this.basicDetailForm.get("approxDate").value ? this.basicDetailForm.get("approxDate").value : null;
        basicDetail.approxCurrentEMI = this.basicDetailForm.get("approxCurrentEMI").value ? this.basicDetailForm.get("approxCurrentEMI").value : null;
        basicDetail.bankId = this.basicDetailForm.get("bankId").value ? this.basicDetailForm.get("bankId").value : null;
        basicDetail.topupAmount = this.basicDetailForm.get("topupAmount").value ? this.basicDetailForm.get("topupAmount").value : null;
        basicDetail.loanType = this.isTransfer.value;
        let res = await this.businessLoanService.insertBusinessLoanBasicDetail(basicDetail, this.token);
        if (res && res.status == 200) {
          if (res.recordList && res.recordList.length > 0) {
            this.customerLoanId = res.recordList[0]._customerLoanId;
            this.customerAddressId = res.recordList[0]._customerAddressId
            this.customerLoanBusinessDetailId = res.recordList[0]._customerLoanBusinessDetailId
            this.customerLoanCurrentResidentTypeId = res.recordList[0]._customerLoanCurrentResidentTypeId
            let customerLoanId = sessionStorage.getItem("customerLoanId");
            if (customerLoanId) {
              sessionStorage.removeItem("customerLoanId")
            }
            sessionStorage.setItem("customerLoanId", JSON.stringify(this.customerLoanId))
            await this.getServiceDocument(this.basicDetailForm.get('employmentTypeId').value);
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

  public async addCompanyDetail(form) {
    if (form.valid) {
      try {
        let businessDetail = this.companyDetailForm.value;
        businessDetail.customerLoanId = this.customerLoanId
        businessDetail.customerLoanBusinessDetailId = this.businessLoan.basicDetail?.customerLoanBusinessDetailId ? this.businessLoan.basicDetail.customerLoanBusinessDetailId : this.customerLoanBusinessDetailId
        await this.businessLoanService.insertUpdateBusinessLoanBusinessDetail(businessDetail, this.token);
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

  public async addBusienssLoanDocument() {
    try {
      let documentError: boolean = false;
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
          this.isSelect = (this.isDone.value) ? true : false;
          if (this.isSelect) {
            let documents = this.documents.filter(c => c.documentData)

            let res = await this.businessLoanService.insertUpdateBusinessLoanDocuments(documents, this.customerLoanId, this.token);
            if (res && res.status == 200) {
              Swal.fire(
                'Successfully Insert Loan',
                'success'
              )
              const modalContent = document.querySelector('.swal2-container');
              sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
              this.spinnerService.hide()
              this.router.navigate(["/business-loan"])
            }
          }
        }
      }
      else {
        this.toastrService.error("Please Upload Required Document")
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

  public async getBusinessLoan(customerLoanId: number) {
    try {
      this.spinnerService.show();
      let res = await this.businessLoanService.getBusinessLoanById(customerLoanId, this.token);
      if (res && res.status == 200) {
        if (res.recordList && res.recordList.length > 0)
          this.businessLoan = res.recordList[0];
        if (this.businessLoan) {
          if (this.businessLoan.basicDetail) {
            this.getCityByPincode(this.businessLoan.basicDetail.pincode, false)
            this.basicDetailForm.setValue({
              'loanAmount': this.businessLoan.basicDetail.loanAmount,
              'fullName': this.businessLoan.basicDetail.fullName,
              'birthdate': this.formatDate(new Date(this.businessLoan.basicDetail.birthdate)),
              'panCardNo': this.businessLoan.basicDetail.panCardNo,
              'email': this.businessLoan.basicDetail.email,
              'gender': this.businessLoan.basicDetail.gender,
              'maritalStatusId': this.businessLoan.basicDetail.maritalStatusId,
              'employmentTypeId': this.businessLoan.basicDetail.employmentTypeId,
              'businessAnnualSale': this.businessLoan.businessDetail.businessAnnualSale,
              'businessExperienceId': this.businessLoan.businessDetail.businessExperienceId,
              'residentTypeId': this.businessLoan.basicDetail.residentTypeId,
              'loanAgainstCollateralId': this.businessLoan.moreBasicDetail.loanagainstcollteralId ? this.businessLoan.moreBasicDetail.loanagainstcollteralId : null,
              'pincode': this.businessLoan.basicDetail && this.businessLoan.basicDetail.pincode != '' ? this.businessLoan.basicDetail.pincode : null,
              'cityId': this.businessLoan.moreBasicDetail?.cityId ? this.businessLoan.moreBasicDetail.cityId : null,
              'addressLine1': this.businessLoan.moreBasicDetail?.addressLine1 ? this.businessLoan.moreBasicDetail.addressLine1 : null,
              'addressLine2': this.businessLoan.moreBasicDetail?.addressLine2 ? this.businessLoan.moreBasicDetail.addressLine2 : null,
              'loanAmountTakenExisting': this.businessLoan.basicDetail.loanAmountTakenExisting,
              'approxCurrentEMI': this.businessLoan.basicDetail.approxCurrentEMI,
              'approxDate': this.businessLoan.basicDetail.approxDate,
              'bankId': this.businessLoan.basicDetail.bankId,
              'topupAmount': this.businessLoan.basicDetail.topupAmount,
            });
            if (this.businessLoan.basicDetail.loanType == 'New') {
              this.isTransfer.setValue('New');
            } else {
              this.isTransfer.setValue('Bank Transfer');
            }
          }
          if (this.businessLoan.businessDetail) {
            this.companyDetailForm.setValue({
              "companyTypeId": this.businessLoan.businessDetail.companyTypeId,
              "businessNatureId": this.businessLoan.businessDetail.businessNatureId,
              "industryTypeId": this.businessLoan.businessDetail.industryTypeId,
              "businessAnnualProfitId": this.businessLoan.businessDetail.businessAnnualProfitId,
              "primaryBankId": this.businessLoan.businessDetail.primaryBankId,
              "currentlyPayEmi": this.businessLoan.businessDetail.currentlyPayEmi ? this.businessLoan.businessDetail.currentlyPayEmi : null,
              "businessName": this.businessLoan.businessDetail.businessName,
              "businessGstNo": this.businessLoan.businessDetail.businessGstNo
            })
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

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  public async getCustomer() {
    try {
      this.spinnerService.show();
      let res = await this.customerService.getCustomer(null, null, this.customerId, this.token);

      if (res && res.status == 200) {

        this.customer = res.recordList;
        if (this.customer[0].pincode) {
          await this.getCityByPincode(this.customer[0].pincode, false)
        }
        this.basicDetailForm.get("fullName").setValue(this.customer[0].fullName ? this.customer[0].fullName : null)
        this.basicDetailForm.get("panCardNo").setValue(this.customer[0].panCardNo ? this.customer[0].panCardNo : null)
        this.basicDetailForm.get("birthdate").setValue(this.customer[0].birthdate ? this.formatDate(new Date(this.customer[0].birthdate)) : null)
        this.basicDetailForm.get("maritalStatusId").setValue(this.customer[0].maritalStatusId ? this.customer[0].maritalStatusId : null)
        this.basicDetailForm.get("gender").setValue(this.customer[0].gender ? this.customer[0].gender : null)
        this.basicDetailForm.get("addressLine1").setValue(this.customer[0].addressLine1 ? this.customer[0].addressLine1 : null)
        this.basicDetailForm.get("cityId").setValue(this.customer[0].cityId ? this.customer[0].cityId : null)
        this.basicDetailForm.get("pincode").setValue(this.customer[0].pincode ? this.customer[0].pincode : null)
        this.basicDetailForm.get("addressLine2").setValue(this.customer[0].addressLine2 ? this.customer[0].addressLine2 : null)
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

  public changeEmploymentType() {
    if (this.businessLoan.loanDocuments && this.businessLoan.loanDocuments.length > 0) {
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
            let res = await this.personalLoanService.changeEmploymentType(this.customerLoanId, 2, this.token);
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
          this.basicDetailForm.get("employmentTypeId").setValue(this.businessLoan.basicDetail.customerLoanEmploymentId)
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

  public changeLoanType() {
    if (this.businessLoan.loanDocuments && this.businessLoan.loanDocuments.length > 0) {
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
            let serviceId = this.businessLoan.basicDetail.serviceId;
            this.businessLoan.basicDetail.loanType = this.isTransfer.value;
            let res = await this.personalLoanService.changeLoanType(this.customerLoanId, serviceId, this.isTransfer.value, this.token);
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
          this.isTransfer.setValue(this.businessLoan.basicDetail.loanType);
        }
      })
      const modalContent = document.querySelector('.swal2-container');
      sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
    }
  }

}