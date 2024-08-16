import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CoApplicantRelation } from 'src/app/shared/models/co-applicant-relation';
import { Customer } from 'src/app/shared/models/customer';
import { EmploymentNature } from 'src/app/shared/models/employment-nature';
import { EmploymentServiceType } from 'src/app/shared/models/employment-service-type';
import { IndustryType } from 'src/app/shared/models/industry-type';
import { AdminHomeLoanEmploymentDetail } from 'src/app/shared/models/loans/adminHomeLoanEmploymentDetail';
import { adminHomeLoanPermanentAddressDetail } from 'src/app/shared/models/loans/adminHomeLoanPermanentAddressDetail';
import { AdminHomeLoanResponse } from 'src/app/shared/models/loans/adminHomeLoanResponse';
import { PropertyType } from 'src/app/shared/models/property-type';
import { ResidenceType } from 'src/app/shared/models/residence-type';
import { ServiceEmploymentType } from 'src/app/shared/models/serviceEmploymentType';
import { ServiceType } from 'src/app/shared/models/servicetype';
import { BankService } from 'src/app/shared/services/bank.service';
import { CoApplicantRelationService } from 'src/app/shared/services/co-applicant-relation.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { DocumentService } from 'src/app/shared/services/document.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { EmploymentNatureService } from 'src/app/shared/services/employment-nature.service';
import { EmploymentServiceTypeService } from 'src/app/shared/services/employment-service-type.service';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
import { HomeLoanService } from 'src/app/shared/services/homeLoan.service';
import { IndustrytTypeService } from 'src/app/shared/services/industry-type.service';
import { MaritalStautusesService } from 'src/app/shared/services/maritalstatus.service';
import { PersonalLoanService } from 'src/app/shared/services/personalLoan.service';
import { PropertyTypeService } from 'src/app/shared/services/property-type.service';
import { ResidenceTypeService } from 'src/app/shared/services/residence-type.service';
import { ServicetypeService } from 'src/app/shared/services/servicetype.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-add-lap',
  templateUrl: './add-lap.component.html',
  styleUrls: ['./add-lap.component.scss']
})
export class AddLapComponent implements OnInit {

  public basicDetailForm: FormGroup;
  public companyDetailForm: FormGroup;
  public token: string;
  public homeLoan = new AdminHomeLoanResponse();
  public alertMessage: string;
  public employmentTypes: ServiceEmploymentType[] = new Array<ServiceEmploymentType>();
  public residenceTypes: ResidenceType[] = new Array<ResidenceType>();
  public cities = [];
  public minDate = new Date();
  public birthDayError: boolean = false;
  public maritalStatuses = [];
  public customerLoanId: number;
  public serviceDocuments = [];
  private customerId: number;
  public documents = [];
  public industryTypes: IndustryType[] = new Array<IndustryType>();
  public companyTypes = [];
  public customerAddressId: number
  public customerLoanBusinessDetailId: number;
  public customerLoanCurrentResidentTypeId: number;
  public customer: Customer[] = new Array<Customer>();
  public propertyTypes: PropertyType[] = new Array<PropertyType>();
  public serviceName: string;
  public coApplicantRelations: CoApplicantRelation[] = new Array<CoApplicantRelation>();
  public coApplicantForm: FormGroup;
  public propertyDetailForm: FormGroup;
  public correspondenceAddressForm: FormGroup
  public permanentAddressForm: FormGroup
  public workForm: FormGroup
  public isSameAddress = new FormControl();
  public coApplicants = [];
  public deleteCoapplicantIds = [];
  public correspondenceAddressCity = [];
  public permanentAdressCity = [];
  public workAddressCities = [];
  public propertyCities = [];
  public employmentNatures: EmploymentNature[] = new Array<EmploymentNature>();
  public selectedEmploymentType: string;
  public selectedCoApplicantEmploymentType: string;
  public serviceTypes: ServiceType[] = new Array<ServiceType>();
  public selectedIndex: number;
  public coApplicantWorkDetails = [];
  public employmentServiceTypes: EmploymentServiceType[] = new Array<EmploymentServiceType>();
  public selectedResidentType: string
  public customerLoanPropertyDetailId: number
  public customerloancurrentresidentdetailId: number
  public isTransfer = new FormControl();
  public transferPropertyDetailForm: FormGroup
  public isTopUp = new FormControl();
  public banks = [];
  public customerLoanPropertyTransferDetailId: number
  public isPropertyValueError: boolean = false;
  public isDone = new FormControl();
  public isSelect: boolean;
  public isRequired: boolean = true;


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
    private residenceTypeService: ResidenceTypeService,
    private homeLoanService: HomeLoanService,
    private industryTypeService: IndustrytTypeService,
    private propertyTypeService: PropertyTypeService,
    private coApplicantRelationService: CoApplicantRelationService,
    private employmentNatureService: EmploymentNatureService,
    private servicetypeService: ServicetypeService,
    private employmentServiceTypeService: EmploymentServiceTypeService,
    private bankService: BankService,
    private personalLoanService: PersonalLoanService,
    public toggleMenuService: ToggleMenuService
  ) {
    this.basicDetailForm = formBuilder.group({
      'loanAmount': [null, [Validators.required]],
      'fullName': [null, [Validators.required]],
      'birthdate': [null, [Validators.required]],
      'panCardNo': [null, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      'maritalStatusId': [null, [Validators.required]],
      'motherName': [null, [Validators.required]],
      "residentTypeId": [null, [Validators.required]],
      "valueOfProperty": [null],
      "rentAmount": [null]
    });
    this.propertyDetailForm = formBuilder.group({
      "propertyTypeId": [null, [Validators.required]],
      "propertyPurchaseValue": [null, [Validators.required]],
      "addressLine1": [null, [Validators.required]],
      "addressLine2": [null],
      "pincode": [null, [Validators.required]],
      "propertyCityId": [null, [Validators.required]],
      "propertyState": [null, [Validators.required]],
      "propertyDistrict": [null, [Validators.required]],
    });
    this.correspondenceAddressForm = formBuilder.group({
      "label": [null, [Validators.required]],
      "addressLine1": [null, [Validators.required]],
      "addressLine2": [null],
      "pincode": [null, [Validators.required]],
      "cityId": [null, [Validators.required]],
      "state": [null, [Validators.required]],
      "district": [null, [Validators.required]],
    });
    this.permanentAddressForm = formBuilder.group({
      "label": [null, [Validators.required]],
      "addressLine1": [null, [Validators.required]],
      "addressLine2": [null],
      "pincode": [null, [Validators.required]],
      "cityId": [null, [Validators.required]],
      "state": [null, [Validators.required]],
      "district": [null, [Validators.required]],
    })
    this.workForm = formBuilder.group({
      "employmentTypeId": [null, [Validators.required]],
      "monthlyIncome": [null, [Validators.required]],
      "industryTypeId": [null],
      "label": [null, [Validators.required]],
      "addressLine1": [null, [Validators.required]],
      "addressLine2": [null],
      "pincode": [null, [Validators.required]],
      "cityId": [null, [Validators.required]],
      "employmentNatureId": [null],
      "employmentServiceTypeId": [null]
    });
    this.transferPropertyDetailForm = formBuilder.group({
      "propertyTypeId": [null, [Validators.required]],
      "propertyPurchaseValue": [null, [Validators.required]],
      "addressLine1": [null, [Validators.required]],
      "addressLine2": [null],
      "pincode": [null, [Validators.required]],
      "propertyCityId": [null, [Validators.required]],
      "propertyState": [null, [Validators.required]],
      "propertyDistrict": [null, [Validators.required]],
      "loanAmountTakenExisting": [null, [Validators.required]],
      "approxDate": [null, [Validators.required]],
      "approxCurrentEMI": [null, [Validators.required]],
      "bankId": [null, [Validators.required]],
      "topupAmount": [null, [Validators.required]],
    })
    this.coApplicantForm = this.formBuilder.group({
      coApplicant: this.formBuilder.array([
      ])
    });
  }

  async ngOnInit() {
    this.isTransfer.setValue("New");
    this.isTopUp.setValue("Yes")
    this.isSameAddress.setValue("Yes")
    this.token = sessionStorage.getItem("SessionToken");
this.route.params.subscribe(async (params) => {
      this.customerId = params['customerId'];
    });
    this.route.params.subscribe(async (params) => {
      this.customerLoanId = params['customerLoanId'];
    });
    await this.getEmploymentServiceType();
    await this.getMaritalStatuses();
    await this.getResidentTypes();

    await this.getIndustryTypes();
    await this.getCoApplicantRelation();
    await this.getEmploymentNature();
    await this.getserviceEmploymentTypes();

    if (this.customerLoanId) {
      await this.getHomeLoan(this.customerLoanId)
    }
    else if (sessionStorage.getItem("customerLoanId")) {
      let customerLoanId = JSON.parse(JSON.stringify(sessionStorage.getItem("customerLoanId")))
      this.customerLoanId = customerLoanId
      this.getHomeLoan(this.customerLoanId)
    }
    if (this.customerId) {
      await this.getCustomer()
    }
    await this.getPropertyType();
    await this.getBanks();
  }

  public onAdd() {
    const control = <FormArray>this.coApplicantForm.controls['coApplicant'];
    control.push(this.getCoApplicant());
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
  public async getEmploymentServiceType() {
    try {
      this.spinnerService.show();
      let res = await this.employmentServiceTypeService.getEmploymentServiceType(null, null, this.token);
      if (res && res.status == 200) {
        this.employmentServiceTypes = res.recordList;
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


  private getCoApplicant() {
    return this.formBuilder.group({
      customerLoanCoApplicantId: [''],
      fullName: ['', Validators.required],
      birthDate: ['', [Validators.required]],
      maritalStatusId: ['', [Validators.required]],
      coApplicantRelationId: ['', [Validators.required]]
    });
  }

  public removeCoApplicant(i: number) {
    const control = <FormArray>this.coApplicantForm.controls['coApplicant'];
    control.removeAt(i);
    this.deleteCoapplicantIds.push(this.coApplicants[i].customerLoanCoApplicantId)
    this.coApplicants.splice(i, 1);
  }

  save(model: any, isValid: boolean, e: any) {
    e.preventDefault();
  }

  public async getPropertyType() {
    try {
      this.spinnerService.show();
      let res = await this.propertyTypeService.getPropertyType(null, null, this.token);
      if (res && res.status == 200) {
        this.propertyTypes = res.recordList;
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

  public async getEmploymentNature() {
    try {
      this.spinnerService.show();
      let res = await this.employmentNatureService.getEmploymentNature(null, null, this.token);
      if (res && res.status == 200) {
        this.employmentNatures = res.recordList;
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


  public async getserviceEmploymentTypes() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getServiceEmploymentType(this.token, 9);
      if (res && res.status == 200) {
        this.employmentTypes = res.recordList;
        if (this.employmentTypes && this.employmentTypes.length > 0) {
          this.spinnerService.hide();
        }
        this.spinnerService.hide();
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

  public async onKeyUpEvent(event: any, ele: string, isChagneCityId, coApplicantWorkDetail?: any) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, isChagneCityId, ele, coApplicantWorkDetail);
      }
    } catch (error) {
      console.log(error);
    }
  }


  public async getCityByPincode(n, isChangeCityId, permanenet?: any, index?: any) {
    try {
      this.spinnerService.show();
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        if (permanenet == 'permanent') {
          this.permanentAdressCity = res.recordList;
          if (this.permanentAdressCity && this.permanentAdressCity.length > 0) {
            this.permanentAddressForm.get("district").setValue(this.permanentAdressCity[0].districtName)
            this.permanentAddressForm.get("state").setValue(this.permanentAdressCity[0].stateName)
            if (isChangeCityId)
              this.permanentAddressForm.get("cityId").setValue(this.permanentAdressCity[0].id)
          }
        }
        else if (permanenet == "correspondence") {
          this.correspondenceAddressCity = res.recordList
          if (this.correspondenceAddressCity && this.correspondenceAddressCity.length > 0) {
            this.correspondenceAddressForm.get("district").setValue(this.correspondenceAddressCity[0].districtName)
            this.correspondenceAddressForm.get("state").setValue(this.correspondenceAddressCity[0].stateName)
            if (isChangeCityId)
              this.correspondenceAddressForm.get("cityId").setValue(this.correspondenceAddressCity[0].id)
          }
        }
        else if (permanenet == "property") {
          this.propertyCities = res.recordList;
          if (this.propertyCities && this.propertyCities.length > 0) {
            if (isChangeCityId) {
              if (this.isTransfer.value == 'New') {
                this.propertyDetailForm.get("propertyCityId").setValue(this.propertyCities[0].id)
                this.propertyDetailForm.get("propertyDistrict").setValue(this.propertyCities[0].districtName)
                this.propertyDetailForm.get("propertyState").setValue(this.propertyCities[0].stateName)
              }
              else {
                this.transferPropertyDetailForm.get("propertyCityId").setValue(this.propertyCities[0].id)
                this.transferPropertyDetailForm.get("propertyDistrict").setValue(this.propertyCities[0].districtName)
                this.transferPropertyDetailForm.get("propertyState").setValue(this.propertyCities[0].stateName)
              }
            }

          }
        }
        else if (permanenet == "workAddress") {
          this.workAddressCities = res.recordList;
          if (this.workAddressCities && this.workAddressCities.length > 0) {
            if (isChangeCityId)
              this.workForm.get("cityId").setValue(this.workAddressCities[0].id)
          }
        }

        else if (permanenet == "coApplicantWorkDetail") {
          this.coApplicantWorkDetails[index].coApplicantWorkDetailCities = res.recordList
          if (this.workAddressCities && this.workAddressCities.length > 0) {
            if (isChangeCityId)
              this.coApplicantWorkDetails[index].cityId = this.coApplicantWorkDetails[index].coApplicantWorkDetailCities[0].id
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

  public getAge(coApplicant?: any, i?: number) {
    let dt2 = new Date();
    let dt1 = coApplicant ? this.coApplicantForm.controls['coApplicant']['controls'][i].get('birthDate').value : this.basicDetailForm.get("birthdate").value;
    dt1 = new Date(dt1);
    let diffYear = (dt2.getTime() - dt1.getTime()) / 1000;
    diffYear /= (60 * 60 * 24);
    let age = Math.abs(Math.round(diffYear / 365.25));
    if (age < 22) {
      if (coApplicant) {
        this.coApplicantForm.controls['coApplicant']['controls'][i].get('birthDate').setErrors({ minAge: true })
      }
      else
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
      let serviceId = 9;
      this.documents = [];
      let res = await this.documentService.getServiceDocument(null, null, serviceId, this.token);
      if (res && res.status == 200) {
        this.serviceDocuments = res.recordList;
        this.serviceDocuments = this.serviceDocuments.filter(c => c.employmentTypeId == employmentTypeId)
        if (this.serviceDocuments && this.serviceDocuments.length > 0) {
          if (!this.homeLoan.loanDocuments || this.homeLoan.loanDocuments.length == 0) {
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
                    "maxSize":this.serviceDocuments[index].maxSize,
                  }
                  if (this.isTransfer.value == 'Bank Transfer') {
                    if (this.serviceDocuments[index].isRequiredForTransfer == 1) {
                      this.documents.push(data);
                    }
                  }else {
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
                  "maxSize":this.serviceDocuments[index].maxSize,
                }
                if (this.isTransfer.value == 'Bank Transfer') {
                  if (this.serviceDocuments[index].isRequiredForTransfer == 1) {
                    this.documents.push(data);
                  }
                }else {
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
                  let documents = this.homeLoan.loanDocuments.filter(c => c.documentId == this.serviceDocuments[index].documentId);
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
                    "maxSize":this.serviceDocuments[index].maxSize,
                  }
                  if (this.isTransfer.value == 'Bank Transfer') {
                    if (this.serviceDocuments[index].isRequiredForTransfer == 1) {
                      this.documents.push(data);
                    }
                  }else {
                    if (this.serviceDocuments[index].isRequiredForNew == 1) {
                      this.documents.push(data);
                    }
                  }
                }
              }
              else {
                let i = this.homeLoan.loanDocuments.findIndex(c => c.documentId == this.serviceDocuments[index].documentId)
                let documentName = i >= 0 ? this.homeLoan.loanDocuments[i].documentName : this.serviceDocuments[index].documentName
                let loanDocumentId = i >= 0 ? this.homeLoan.loanDocuments[i].loanDocumentId : null;
                let documentData = i >= 0 ? this.homeLoan.loanDocuments[i].documentUrl : null;
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
                  "maxSize":this.serviceDocuments[index].maxSize,
                }
                if (this.isTransfer.value == 'Bank Transfer') {
                  if (this.serviceDocuments[index].isRequiredForTransfer == 1) {
                    this.documents.push(data);
                  }
                }else {
                  if (this.serviceDocuments[index].isRequiredForNew == 1) {
                    this.documents.push(data);
                  }
                }
              }
            }
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
      this.toastrService.error(this.alertMessage);
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
        this.spinnerService.hide();
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
        this.basicDetailForm.get("fullName").setValue(this.customer[0].fullName ? this.customer[0].fullName : null)
        this.basicDetailForm.get("panCardNo").setValue(this.customer[0].panCardNo ? this.customer[0].panCardNo : null)
        this.basicDetailForm.get("birthdate").setValue(this.customer[0].birthdate ? this.formatDate(new Date(this.customer[0].birthdate)) : null)
        this.basicDetailForm.get("maritalStatusId").setValue(this.customer[0].maritalStatusId ? this.customer[0].maritalStatusId : null)
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

  public async getServiceType() {
    try {
      this.spinnerService.show();
      let res = await this.servicetypeService.getServicetype(null, null, this.token);
      if (res && res.status == 200) {
        this.serviceTypes = res.recordList;
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

  public async getHomeLoan(customerLoanId: number) {
    try {
      this.spinnerService.show();
      let res = await this.homeLoanService.getHomeLoanById(customerLoanId, this.token);
      if (res && res.status == 200) {
        this.homeLoan = res.recordList[0];
        if (res.recordList && res.recordList.length > 0) {
          this.customerLoanCurrentResidentTypeId = res.recordList[0].residenceDetail ? res.recordList[0].residenceDetail.customerLoanCurrentResidentTypeId : null
          this.basicDetailForm.setValue({
            'loanAmount': res.recordList[0].basicDetail.loanAmount,
            'fullName': res.recordList[0].basicDetail.fullName,
            'birthdate': this.formatDate(new Date(res.recordList[0].basicDetail.birthdate)),
            'panCardNo': res.recordList[0].basicDetail.panCardNo,
            'maritalStatusId': res.recordList[0].basicDetail.maritalStatusId,
            'motherName': res.recordList[0].basicDetail.motherName,
            "residentTypeId": res.recordList[0].residenceDetail?.residentTypeId ? res.recordList[0].residenceDetail.residentTypeId : null,
            "valueOfProperty": res.recordList[0].residenceDetail?.valueOfProperty ? res.recordList[0].residenceDetail.valueOfProperty : null,
            "rentAmount": res.recordList[0].residenceDetail?.rentAmount ? res.recordList[0].residenceDetail.rentAmount : null
          });
          this.selectedResidentType = res.recordList[0].residenceDetail ? this.residenceTypes.find(c => c.id == res.recordList[0].residenceDetail.residentTypeId).name : null
          if (res.recordList[0].permanentAddressDetail) {
            if (res.recordList[0].permanentAddressDetail.cityId)
              await this.getCityByPincode(res.recordList[0].permanentAddressDetail.pincode, false, 'permanent');
            this.homeLoan.permanentAddressDetail = res.recordList[0].permanentAddressDetail
            this.permanentAddressForm.setValue({
              "label": res.recordList[0].permanentAddressDetail.label,
              "addressLine1": res.recordList[0].permanentAddressDetail.addressLine1,
              "addressLine2": res.recordList[0].permanentAddressDetail.addressLine2 ? res.recordList[0].permanentAddressDetail.addressLine2 : null,
              "pincode": res.recordList[0].permanentAddressDetail.pincode ? res.recordList[0].permanentAddressDetail.pincode : null,
              "cityId": res.recordList[0].permanentAddressDetail.cityId ? res.recordList[0].permanentAddressDetail.cityId : null,
              "state": this.permanentAdressCity && this.permanentAdressCity.length > 0 && this.permanentAdressCity[0].stateName ? this.permanentAdressCity[0].stateName : null,
              "district": this.permanentAdressCity && this.permanentAdressCity.length > 0 && this.permanentAdressCity[0].districtName ? this.permanentAdressCity[0].districtName : null,
            })
          }
          if (res.recordList[0].correspondenceAddressDetail) {
            if (res.recordList[0].correspondenceAddressDetail)
              this.homeLoan.correspondenceAddressDetail = res.recordList[0].correspondenceAddressDetail
            await this.getCityByPincode(res.recordList[0].correspondenceAddressDetail.pincode, false, 'correspondence');
            this.correspondenceAddressForm.setValue({
              "label": res.recordList[0].correspondenceAddressDetail.label,
              "addressLine1": res.recordList[0].correspondenceAddressDetail.addressLine1,
              "addressLine2": res.recordList[0].correspondenceAddressDetail.addressLine2 ? res.recordList[0].correspondenceAddressDetail.addressLine2 : null,
              "pincode": res.recordList[0].correspondenceAddressDetail.pincode ? res.recordList[0].correspondenceAddressDetail.pincode : null,
              "cityId": res.recordList[0].correspondenceAddressDetail.cityId ? res.recordList[0].correspondenceAddressDetail.cityId : null,
              "state": this.correspondenceAddressCity && this.correspondenceAddressCity.length > 0 && this.correspondenceAddressCity[0].stateName ? this.correspondenceAddressCity[0].stateName : null,
              "district": this.correspondenceAddressCity?.length && this.correspondenceAddressCity[0].districtName ? this.correspondenceAddressCity[0].districtName : null,

            })
          }
          if (res.recordList[0].permanentAddressDetail && res.recordList[0].correspondenceAddressDetail) {
            if (res.recordList[0].permanentAddressDetail.addressLine1 == res.recordList[0].correspondenceAddressDetail.addressLine1 &&
              res.recordList[0].permanentAddressDetail.addressLine2 == res.recordList[0].correspondenceAddressDetail.addressLine2 &&
              res.recordList[0].permanentAddressDetail.label == res.recordList[0].correspondenceAddressDetail.label &&
              res.recordList[0].permanentAddressDetail.cityId == res.recordList[0].correspondenceAddressDetail.cityId &&
              res.recordList[0].permanentAddressDetail.pincode == res.recordList[0].correspondenceAddressDetail.pincode) {
              this.isSameAddress.setValue("Yes")
            }
            else {
              this.isSameAddress.setValue("No")
            }
          }
          else {
            this.isSameAddress.setValue("Yes")
          }
          if (res.recordList[0].propertyDetail) {
            this.homeLoan.propertyDetail = res.recordList[0].propertyDetail
            this.customerLoanPropertyDetailId = res.recordList[0].propertyDetail.customerLoanPropertyDetailId
            await this.getCityByPincode(res.recordList[0].propertyDetail.pincode, false, 'property')
            this.propertyDetailForm.setValue({
              "propertyTypeId": res.recordList[0].propertyDetail.propertyTypeId,
              "propertyPurchaseValue": res.recordList[0].propertyDetail.propertyPurchaseValue,
              "addressLine1": res.recordList[0].propertyDetail.addressLine1,
              "addressLine2": res.recordList[0].propertyDetail.addressLine2 ?  res.recordList[0].propertyDetail.addressLine2 : null,
              "pincode": res.recordList[0].propertyDetail.pincode,
              "propertyCityId": res.recordList[0].propertyDetail.propertyCityId,
              "propertyState": res.recordList[0].propertyDetail.propertyState,
              "propertyDistrict": res.recordList[0].propertyDetail.propertyDistrict
            })
            if (this.homeLoan.basicDetail.loanType == 'New')
              this.isTransfer.setValue('New');
            else {
              this.isTransfer.setValue('Bank Transfer');
              if (res.recordList[0].transferPropertyDetail) {
                this.customerLoanPropertyTransferDetailId = res.recordList[0].transferPropertyDetail.customerLoanTransferPropertyDetailId
                this.transferPropertyDetailForm.setValue({
                  "propertyTypeId": res.recordList[0].propertyDetail.propertyTypeId,
                  "propertyPurchaseValue": res.recordList[0].propertyDetail.propertyPurchaseValue,
                  "addressLine1": res.recordList[0].propertyDetail.addressLine1,
                  "addressLine2": res.recordList[0].propertyDetail.addressLine2 ? res.recordList[0].propertyDetail.addressLine2 : null,
                  "pincode": res.recordList[0].propertyDetail.pincode,
                  "propertyCityId": res.recordList[0].propertyDetail.propertyCityId,
                  "propertyState": res.recordList[0].propertyDetail.propertyState,
                  "propertyDistrict": res.recordList[0].propertyDetail.propertyDistrict,
                  "loanAmountTakenExisting": res.recordList[0].transferPropertyDetail.loanAmountTakenExisting,
                  "approxDate": res.recordList[0].transferPropertyDetail.approxDate,
                  "approxCurrentEMI": res.recordList[0].transferPropertyDetail.approxCurrentEMI,
                  "bankId": res.recordList[0].transferPropertyDetail.bankId,
                  "topupAmount": res.recordList[0].transferPropertyDetail.topupAmount ? res.recordList[0].transferPropertyDetail.topupAmount : null
                });
                if (res.recordList[0].transferPropertyDetail.topupAmount) {
                  this.isTopUp.setValue('Yes')
                }
                else {
                  this.isTopUp.setValue('No')
                }
              }
            }

          }
          if (res.recordList[0].employmentDetail) {
            this.homeLoan.employmentDetail = res.recordList[0].employmentDetail
            this.workForm.setValue({
              "employmentTypeId": this.homeLoan.employmentDetail.employmentTypeId,
              "monthlyIncome": this.homeLoan.employmentDetail.monthlyIncome,
              "industryTypeId": this.homeLoan.employmentDetail.industryTypeId ? this.homeLoan.employmentDetail.industryTypeId : null,
              "label": this.homeLoan.employmentDetail.label,
              "addressLine1": this.homeLoan.employmentDetail.addressLine1,
              "addressLine2": this.homeLoan.employmentDetail.addressLine2 ?  this.homeLoan.employmentDetail.addressLine2 : null,
              "pincode": this.homeLoan.employmentDetail.pincode,
              "cityId": this.homeLoan.employmentDetail.cityId,
              "employmentNatureId": this.homeLoan.employmentDetail.employmentNatureId ? this.homeLoan.employmentDetail.employmentNatureId : null,
              "employmentServiceTypeId": this.homeLoan.employmentDetail.employmentServiceTypeId ? this.homeLoan.employmentDetail.employmentServiceTypeId : null,
            });
            this.selectedEmploymentType = this.employmentTypes.find(c => c.employmentTypeId == this.homeLoan.employmentDetail.employmentTypeId).employmentType
            this.getCityByPincode(this.homeLoan.employmentDetail.pincode, false, 'workAddress')
          }
          if (res.recordList[0].coapplicants && res.recordList[0].coapplicants.length > 0) {
            this.coApplicants = res.recordList[0].coapplicants;
            for (let index = 0; index < this.coApplicants.length; index++) {
              this.onAdd();
              this.coApplicantForm = this.formBuilder.group({
                coApplicant: this.formBuilder.array(this.coApplicants.map(coApplicant => this.createCoApplicant(coApplicant)))
              });
              if (this.coApplicants[index].customerloancoapplicantemploymentdetailId) {
                let data = {
                  "customerloancoapplicantemploymentdetailId": this.coApplicants[index].customerloancoapplicantemploymentdetailId,
                  "employmentServiceTypeId": this.coApplicants[index].employmentServiceTypeId ? this.coApplicants[index].employmentServiceTypeId : null,
                  "employmentNatureId": this.coApplicants[index].employmentNatureId ? this.coApplicants[index].employmentNatureId : null,
                  "industryTypeId": this.coApplicants[index].industryTypeId ? this.coApplicants[index].industryTypeId : null,
                  "pincode": this.coApplicants[index].pincode ? this.coApplicants[index].pincode : null,
                  "cityId": this.coApplicants[index].cityId ? this.coApplicants[index].cityId : null,
                  "addressLine1": this.coApplicants[index].addressLine1 ? this.coApplicants[index].addressLine1 : null,
                  "addressLine2": this.coApplicants[index].addressLine2 ? this.coApplicants[index].addressLine2 : null,
                  "customerLoanCoApplicantId": this.coApplicants[index].customerLoanCoApplicantId,
                  "fullName": this.coApplicants[index].fullName,
                  "employmentTypeId": this.coApplicants[index].employmentTypeId,
                  "employmentType": this.employmentTypes.find(c => c.employmentTypeId == this.coApplicants[index].employmentTypeId).employmentType,
                  "monthlyIncome": this.coApplicants[index].monthlyIncome,
                  "label": this.coApplicants[index].label ? this.coApplicants[index].label : null,
                }
                this.coApplicantWorkDetails.push(data);
                this.getCityByPincode(this.coApplicants[index].pincode, false, 'coApplicantWorkDetail', index)
              }


            }
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public createCoApplicant(coApplicant): FormGroup {
    return this.formBuilder.group({
      customerLoanCoApplicantId: [coApplicant.customerLoanCoApplicantId],
      fullName: [coApplicant.fullName],
      birthDate: [this.formatDate(new Date(coApplicant.birthDate))],
      maritalStatusId: [coApplicant.maritalStatusId],
      coApplicantRelationId: [coApplicant.coApplicantRelationId]
    });
  }

  public async selectedImage(e: any, ele: any, i: number) {

    const reader = new FileReader();
    if (e.target.files?.length) {
      if (e.target.files[0].size) {
        let size = ele.maxSize
        let fileSize = e.target.files[0].size * (0.001);
        if (fileSize > size){
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

  public async getCoApplicantRelation() {
    try {
      this.spinnerService.show();
      let res = await this.coApplicantRelationService.getCoApplicantRelation(null, null, this.token);
      if (res && res.status == 200) {
        this.coApplicantRelations = res.recordList;
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

  public getSelectedEmploymentType(coApplicant?: string, e?: any, i?: number) {
    if (coApplicant == 'coApplicant') {
      let index = this.employmentTypes.findIndex(c => c.employmentTypeId == e.employmentTypeId);
      let employmentType = null
      if (index >= 0) {
        employmentType = this.employmentTypes[index].employmentType
      }
      if (employmentType == 'Salaried') {
        this.coApplicantWorkDetails[i].employmentType = "Salaried"
      }
      else {
        this.coApplicantWorkDetails[i].employmentType = "Self Employee"
      }
    }

    else
      this.selectedEmploymentType = this.employmentTypes.find(c => c.employmentTypeId == this.workForm.get('employmentTypeId').value).employmentType
  }

  public async addBasicDetail(form, model) {
    if (form.valid) {
      try {
        this.spinnerService.show()
        let valid: boolean = false;
        let basicDetail = this.basicDetailForm.value;
        if (this.coApplicantForm.controls['coApplicant']['controls'].length > 0) {
          for (let index = 0; index < this.coApplicantForm.controls['coApplicant']['controls'].length; index++) {
            if (this.coApplicantForm.controls['coApplicant']['controls'][index].valid)
              valid = true;
            else {
              valid = false;
              break;
            }
          }
        }
        else {
          valid = true;
        }
        if (valid) {
          if (model && model.coApplicant.length > 0) {
            basicDetail.coApplicant = model.coApplicant;
            this.coApplicants = model.coApplicant;
          }
          basicDetail.customerId = this.customerId
          basicDetail.serviceId = 9;
          basicDetail.customerLoanId = this.customerLoanId ? this.customerLoanId : null;
          basicDetail.deleteCoapplicantIds = this.deleteCoapplicantIds;
          basicDetail.customerloancurrentresidentdetailId = this.customerloancurrentresidentdetailId ? this.customerloancurrentresidentdetailId : null;
          basicDetail.userId = this.customer[0].userId;
          basicDetail.loanType = this.isTransfer.value
          let res = await this.homeLoanService.insertHomeLoanBasicDetail(basicDetail, this.token);
          if (res && res.status == 200) {
            this.customerLoanId = res.recordList.customerLoanId
            let customerLoanId = sessionStorage.getItem("customerLoanId");
            if (customerLoanId) {
              sessionStorage.removeItem("customerLoanId")
            }
            sessionStorage.setItem("customerLoanId", JSON.stringify(this.customerLoanId))
            this.customerloancurrentresidentdetailId = res.recordList.customerloancurrentresidentdetailId

            if (res.recordList.coApplicantIds && res.recordList.coApplicantIds.length > 0) {
              for (let index = 0; index < res.recordList.coApplicantIds.length; index++) {
                this.coApplicants.forEach(element => {
                  if (element.fullName == res.recordList.coApplicantIds[index].coApplicantName)
                    element.customerLoanCoApplicantId = res.recordList.coApplicantIds[index].customerLoanCoApplicantId
                });

              }
            }
            if (this.isTransfer.value == 'New')
              this.propertyDetailForm.get("propertyPurchaseValue").addValidators([Validators.min(this.basicDetailForm.get("loanAmount").value)]);
            if (this.isTransfer.value == 'Bank Transfer')
              this.transferPropertyDetailForm.get("propertyPurchaseValue").addValidators([Validators.min(this.basicDetailForm.get("loanAmount").value)]);
          }
        }

        this.spinnerService.hide()

      } catch (error) {

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
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }

  }

  public async addPropertyDetail() {
    let valid: boolean = false
    if (this.isTransfer.value == 'Bank Transfer') {
      if (this.transferPropertyDetailForm.valid)
        valid = true;
    }
    else {
      if (this.propertyDetailForm.valid)
        valid = true;
    }
    if (valid) {
      try {
        this.spinnerService.show();
        let propertyDetail
        if (this.propertyDetailForm.get("propertyPurchaseValue").value < this.basicDetailForm.get("loanAmount").value) {
          this.isPropertyValueError = true;
        }
        else {
          this.isPropertyValueError = false;
          if (this.isTransfer.value == 'New')
            propertyDetail = this.propertyDetailForm.value;
          if (this.isTransfer.value == 'Bank Transfer')
            propertyDetail = this.transferPropertyDetailForm.value;
          propertyDetail.loanTypeName = this.isTransfer.value
          propertyDetail.customerLoanPropertyDetailId = this.customerLoanPropertyDetailId ? this.customerLoanPropertyDetailId : null;
          propertyDetail.customerLoanId = this.customerLoanId;
          let correspondenceAddress: any;
          let permanentAddress: any;
          if (this.isSameAddress.value == "Yes") {
            this.permanentAddressForm.setValue({
              "label": this.correspondenceAddressForm.get('label').value,
              "addressLine1": this.correspondenceAddressForm.get('addressLine1').value,
              "addressLine2": this.correspondenceAddressForm.get('addressLine2').value,
              "pincode": this.correspondenceAddressForm.get('pincode').value,
              "cityId": this.correspondenceAddressForm.get('cityId').value,
              "state": this.correspondenceAddressForm.get('state').value,
              "district": this.correspondenceAddressForm.get('district').value
            })
          }
          correspondenceAddress = this.correspondenceAddressForm.value;
          permanentAddress = this.permanentAddressForm.value;
          permanentAddress.customerAddressId = this.homeLoan.permanentAddressDetail?.customerAddressId ? this.homeLoan.permanentAddressDetail.customerAddressId : null
          correspondenceAddress.customerAddressId = this.homeLoan.correspondenceAddressDetail?.customerAddressId ? this.homeLoan.correspondenceAddressDetail.customerAddressId : null
          permanentAddress.addressTypeId = 1;
          correspondenceAddress.addressTypeId = 3;
          permanentAddress.addressLine2 = this.permanentAddressForm.get("addressLine2").value ? this.permanentAddressForm.get("addressLine2").value : null;
          correspondenceAddress.addressLine2 = this.correspondenceAddressForm.get("addressLine2").value ? this.correspondenceAddressForm.get("addressLine2").value : null;
          let addresses = [];
          addresses.push(permanentAddress);
          addresses.push(correspondenceAddress);
          propertyDetail.customerAddresses = addresses;
          propertyDetail.propertyCity = this.propertyCities.find(c => c.id == propertyDetail.propertyCityId).name
          propertyDetail.customerId = this.customerId
          propertyDetail.customerLoanPropertyDetailId = this.customerLoanPropertyDetailId ? this.customerLoanPropertyDetailId : null;
          propertyDetail.customerLoanTransferPropertyDetailId = this.customerLoanPropertyTransferDetailId ? this.customerLoanPropertyTransferDetailId : null;
          propertyDetail.topupAmount = this.isTopUp.value == 'Yes' ? this.transferPropertyDetailForm.get("topupAmount").value : null
          propertyDetail.addressLine2 = this.propertyDetailForm.get("addressLine2").value ? this.propertyDetailForm.get("addressLine2").value : null
          let res = await this.homeLoanService.insertHomeLoanPropertyDetail(propertyDetail, this.token);
          if (res && res.status == 200) {
            this.homeLoan.propertyDetail = '';
            this.customerLoanPropertyDetailId = res.recordList.customerLoanPropertyDetailId
            this.customerLoanPropertyTransferDetailId = res.recordList.propertyTransferDetailId;
            this.homeLoan.permanentAddressDetail = this.homeLoan.permanentAddressDetail ? this.homeLoan.permanentAddressDetail : new adminHomeLoanPermanentAddressDetail();
            this.homeLoan.correspondenceAddressDetail = this.homeLoan.correspondenceAddressDetail ? this.homeLoan.correspondenceAddressDetail : new adminHomeLoanPermanentAddressDetail();
            this.homeLoan.permanentAddressDetail.customerAddressId = res.recordList.customerAddressIds.find(c => c.addressTypeId == 1).customerAddressId
            this.homeLoan.correspondenceAddressDetail.customerAddressId = res.recordList.customerAddressIds.find(c => c.addressTypeId == 3).customerAddressId;
            if (this.coApplicants && this.coApplicants.length > 0) {
              for (let index = 0; index < this.coApplicants.length; index++) {
                if (this.coApplicantWorkDetails && this.coApplicantWorkDetails.length > 0) {
                  let workIndex = this.coApplicantWorkDetails.findIndex(c => c.customerLoanCoApplicantId == this.coApplicants[index].customerLoanCoApplicantId)
                  if (workIndex < 0) {
                    let data = {
                      employmentTypeId: null,
                      industryTypeId: null,
                      monthlyIncome: null,
                      employmentServiceTypeId: null,
                      employmentnatureId: null,
                      label: null,
                      addressLine1: null,
                      addressLine2: null,
                      cityId: null,
                      pincode: null,
                      fullName: this.coApplicants[index].fullName,
                      customerLoanCoApplicantId: this.coApplicants[index].customerLoanCoApplicantId ? this.coApplicants[index].customerLoanCoApplicantId : null
                    }
                    this.coApplicantWorkDetails.push(data)
                  }
                }
                else {
                  let data = {
                    employmentTypeId: null,
                    industryTypeId: null,
                    monthlyIncome: null,
                    employmentServiceTypeId: null,
                    employmentnatureId: null,
                    label: null,
                    addressLine1: null,
                    addressLine2: null,
                    cityId: null,
                    pincode: null,
                    fullName: this.coApplicants[index].fullName,
                    customerLoanCoApplicantId: this.coApplicants[index].customerLoanCoApplicantId ? this.coApplicants[index].customerLoanCoApplicantId : null
                  }
                  this.coApplicantWorkDetails.push(data)
                }
              }
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
    else {
      let form = this.isTransfer ? this.transferPropertyDetailForm : this.propertyDetailForm
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  public async addHomeLoanDocument() {
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
            let res = await this.homeLoanService.insertHomeLoanDocuments(documents, this.customerLoanId, this.token);
            if (res && res.status == 200) {
              Swal.fire(
                'Successfully Insert Loan',
                'success'
              )
              const modalContent = document.querySelector('.swal2-container');
              sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
              this.spinnerService.hide()
              this.router.navigate(["/LAP"])
            }

          }
        }
      }
      else {
        this.toastrService.error("Please Upload Document")
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

  public async addHomeLoanWorkDetail(form: NgForm) {
    if (form.valid && this.workForm.valid) {

      try {
        this.spinnerService.show();
        let workDetail = this.workForm.value;
        workDetail.customerLoanId = this.customerLoanId;
        workDetail.customerId = this.customerId;
        workDetail.customerloanemploymentdetailId = this.homeLoan.employmentDetail?.customerloanemploymentdetailId ? this.homeLoan.employmentDetail.customerloanemploymentdetailId : null
        workDetail.customerLoanCoApplicantEmploymentDetails = this.coApplicantWorkDetails
        workDetail.companyAddressId = this.homeLoan.employmentDetail?.companyAddressId ? this.homeLoan.employmentDetail.companyAddressId : null
        workDetail.addressLine2 = this.workForm.get("addressLine2").value ? this.workForm.get("addressLine2").value : null;
        let res = await this.homeLoanService.insertHomeLoanWorkDetail(workDetail, this.token);
        if (res && res.status == 200) {
          this.homeLoan.employmentDetail = new AdminHomeLoanEmploymentDetail();
          this.homeLoan.employmentDetail.customerloanemploymentdetailId = res.recordList.customerloanemploymentdetailId
          this.homeLoan.employmentDetail.companyAddressId = res.recordList.companyAddressId
          if (res.recordList.customerloancoapplicantemploymentdetailIds && res.recordList.customerloancoapplicantemploymentdetailIds.length > 0) {
            for (let index = 0; index < res.recordList.customerloancoapplicantemploymentdetailIds.length; index++) {
              this.coApplicantWorkDetails.forEach(ele => {
                if (ele.customerLoanCoApplicantId == res.recordList.customerloancoapplicantemploymentdetailIds[index].customerLoanCoApplicantId) {
                  ele.customerloancoapplicantemploymentdetailId = res.recordList.customerloancoapplicantemploymentdetailIds[index].customerloancoapplicantemploymentdetailId
                }
              })
            }
          }
          await this.getServiceDocument(this.workForm.get('employmentTypeId').value);
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
    else {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      Object.keys(this.workForm.controls).forEach(key => {
        this.workForm.controls[key].markAsTouched();
      });
    }
  }

  public getSelectedResidentType() {
    let residentType = this.residenceTypes.find(c => c.id == this.basicDetailForm.get('residentTypeId').value).name;
    if (residentType == "Rented") {
      this.selectedResidentType = 'Rented';
    }
    else if (residentType == 'Self Owned') {
      this.selectedResidentType = 'Self Owned';
    }
  }

  public changeEmploymentType() {
    if (this.homeLoan.loanDocuments && this.homeLoan.loanDocuments.length > 0) {
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
            let res = await this.personalLoanService.changeEmploymentType(this.customerLoanId, 9, this.token);
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
          this.workForm.get("employmentTypeId").setValue(this.homeLoan.basicDetail.customerLoanEmploymentId)
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
    if (this.homeLoan.loanDocuments && this.homeLoan.loanDocuments.length > 0) {
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
            this.homeLoan.propertyDetail.loanType = this.isTransfer.value;
            let serviceId = this.homeLoan.basicDetail.serviceId;
            let res = await this.personalLoanService.changeLoanType(this.customerLoanId, serviceId,this.isTransfer.value, this.token);
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
          this.isTransfer.setValue(this.homeLoan.propertyDetail.loanType);
        }
      })
      const modalContent = document.querySelector('.swal2-container');
      sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
    }
  }
  
}