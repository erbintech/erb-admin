import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/shared/models/bank';
import { BankLoanPolicy } from 'src/app/shared/models/bank-loan-policy';
import { EmploymentType } from 'src/app/shared/models/employmentType';
import { Itr } from 'src/app/shared/models/itr';
import { Services } from 'src/app/shared/models/service';
import { BankLoanPolicyService } from 'src/app/shared/services/bank-loan-policy.service';
import { BankLoanService } from 'src/app/shared/services/bank-loan.service';
import { BankService } from 'src/app/shared/services/bank.service';
import { BankCreditCardService } from 'src/app/shared/services/bankCreditCard.service';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
import { ItrService } from 'src/app/shared/services/itr.service';
import { ServicesService } from 'src/app/shared/services/services.service';

@Component({
  selector: 'app-add-bank-loan-policy',
  templateUrl: './add-bank-loan-policy.component.html',
  styleUrls: ['./add-bank-loan-policy.component.scss']
})
export class AddBankLoanPolicyComponent implements OnInit {
  public bankPolicyForm: FormGroup;
  public token: string = '';
  public alertMessage: string = '';
  public banks: Bank[] = new Array<Bank>();
  public services: Services[] = new Array<Services>();
  public employmentTypes: EmploymentType[] = new Array<EmploymentType>();
  public bankLoans = [];
  public bankLoanPolicy = new BankLoanPolicy();
  public bankId: any;
  public selectedServices = [];
  public itrs: Itr[] = new Array<Itr>();
  public policies = [];
  public PolicyColumns = ['id', 'serviceName', 'employmentType', 'vintage', 'minTurnOver', 'maxTurnOver', 'itrRequired', 'minIncome', 'companyCategoryType', 'loanAmount', 'ROI', 'tenure', 'action']
  public policyId: any
  public companyCategoryTypes = [];

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private bankService: BankService,
    private toastrService: ToastrService,
    private servicesService: ServicesService,
    private employmentTypeService: EmploymentTypeService,
    private bankLoanService: BankLoanService,
    private bankLoanPolicyService: BankLoanPolicyService,
    private router: Router,
    private route: ActivatedRoute,
    private itrService: ItrService,
    private bankCreditCardService: BankCreditCardService,
  ) {
    this.bankPolicyForm = formBuilder.group({
      'bankId': [null, [Validators.required]],
      "serviceId": [null, [Validators.required]],
      "employmentTypeId": [null],
      "companyCategoryTypeId": [null],
      "cibilScore": [null],
      "minIncome": [null],
      "vintage": [null],
      "minTurnOver": [null],
      "maxTurnOver": [null],
      "tenure": [null],
      "ROI": [null],
      "minLoanAmount": [null],
      "maxLoanAmount": [null],
      "itrRequired": [null]
    });
  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.bankId = params['id'];
    });
    this.token = sessionStorage.getItem("SessionToken");
    await this.getBanks();
    await this.getServices();
    await this.getEmploymentType();
    await this.getBankLoans();
    await this.getItr();
    await this.getCompanyCategoryType();
    if (this.bankId) {
      await this.getBankLoanPolicy();
    }

  }

  public async getItr() {
    try {
      this.spinnerService.show();
      let res = await this.itrService.getItr(null, null, this.token);
      if (res && res.status == 200) {
        this.itrs = res.recordList;
        if (this.itrs && this.itrs.length > 0) {
          this.itrs.forEach(ele => {
            ele.displayItrName = ele.name + ' Year'
          })
        }
      }
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error?.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error?.error?.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.toastrService.error(this.alertMessage)
    }
  }

  public async getCompanyCategoryType() {
    try {
      this.spinnerService.show();
      let res = await this.bankCreditCardService.getCompanyCategoryTypes(null, null, this.token);
      if (res && res.status == 200) {
        this.companyCategoryTypes = res.recordList;
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

  private async getBanks() {
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

  private async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.servicesService.getServices(null, null, this.token);
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public async getEmploymentType() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getEmploymentType(this.token);
      if (res && res.status == 200) {
        this.employmentTypes = res.recordList;
        if (this.employmentTypes && this.employmentTypes.length > 0) {
          this.employmentTypes.forEach(ele => {
            let data = this.employmentTypes.filter(c => c.parentId == ele.id);
            ele.childEmploymentType = data;
          });
          this.employmentTypes = this.employmentTypes.filter(c => c.parentId == undefined)
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

  private async getBankLoans() {
    try {
      this.spinnerService.show();
      let res = await this.bankLoanService.getBankLoans(null, null, null, null, this.token);
      if (res && res.status == 200) {
          this.bankLoans = res.recordList;
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

  private async getBankLoanPolicy() {
    try {
      this.spinnerService.show();
      let res = await this.bankLoanPolicyService.getBankLoanPolicy(this.bankId, this.token);
      if (res && res.status == 200) {
          this.bankLoanPolicy = res.recordList[0];
          this.policies = this.bankLoanPolicy.policies
          this.bankPolicyForm.get("bankId").setValue(this.bankLoanPolicy.bankId)
         
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

  public getService() {
    if (this.bankPolicyForm.get("bankId").value) {
      this.selectedServices = [];
      let bankLoans = this.bankLoans.filter(c => c.bankId == this.bankPolicyForm.get("bankId").value);
      if (bankLoans && bankLoans.length > 0) {
        for (let index = 0; index < bankLoans.length; index++) {
          let data = this.services.find(c => c.id == bankLoans[index].serviceId)
          this.selectedServices.push(data);
        }
      }
    }
  }

  public async insertBankLoanPolicy() {
    try {
      this.spinnerService.show();
      let data = {
        "bankId": this.bankPolicyForm.get("bankId").value,
        "policies": this.policies
      }
      let res = await this.bankLoanPolicyService.insertBankLoanPolicy(data, this.token);
      if (res && res.status == 200) {
        this.router.navigate(["/bankLoanPolicy"])
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

  public async cancelUser() {
    this.router.navigate(["bankLoanPolicy"]);
  }

  public addMorePolicy() {
    if (this.bankPolicyForm.valid) {
      let policy = this.bankPolicyForm.value;
      let index = this.bankLoans.find(c => c.bankId == policy.bankId, c => c.serviceId == policy.serviceId)
      if (index >= 0)
        policy.bankLoanId = this.bankLoans[index].id;
      if (this.policyId >= 0 && this.policyId != null) {
        policy.serviceName = this.services.find(c => c.id == policy.serviceId).name
        policy.companyCategoryType = policy.companyCategoryTypeId ? this.companyCategoryTypes.find(c => c.id == policy.companyCategoryTypeId).name : '';
        policy.employmentType = policy.serviceId != 2 ? this.employmentTypes.find(c => c.id == policy.employmentTypeId).name : null;
        policy.itrYear = policy.itrRequired ? this.itrs.find(c => c.id == policy.itrRequired).name : null;
        policy.id = this.bankLoanPolicy.id ? this.bankLoanPolicy.id : null;
        this.policies[this.policyId] = policy
          this.policies = [...this.policies]
      }
      else {
        policy.serviceName = this.services.find(c => c.id == policy.serviceId).name
        policy.companyCategoryType = policy.companyCategoryTypeId ? this.companyCategoryTypes.find(c => c.id == policy.companyCategoryTypeId).name : '';
        policy.employmentType = policy.serviceId != 2 ? this.employmentTypes.find(c => c.id == policy.employmentTypeId).name : null
        policy.itrYear = policy.itrRequired ? this.itrs.find(c => c.id == policy.itrRequired).name : null;
        let ind = this.policies.findIndex((c: any) => c.id == policy.id)
        if (ind >= 0) {
          this.toastrService.error("Data Already Exists")
        } else {
          this.policies.push(policy);
          this.policies = [...this.policies]
        }
      }
      this.policyId = null;
      this.bankPolicyForm.reset();
      this.bankPolicyForm.get("bankId").setValue(policy.bankId)
      this.bankLoanPolicy = null
    }
    else {
      Object.keys(this.bankPolicyForm.controls).forEach(key => {
        this.bankPolicyForm.controls[key].markAsTouched();
      });
    }

  }

  public editPolicyForm(element: BankLoanPolicy, i: number) {
    this.policyId = i;
    this.bankLoanPolicy = element;
    this.bankPolicyForm.setValue({
      "bankId": element.bankId ? element.bankId : null,
      "serviceId": element.serviceId ? element.serviceId : null,
      "employmentTypeId": element.employmentTypeId ? element.employmentTypeId : null,
      "companyCategoryTypeId": element.companyCategoryTypeId ? element.companyCategoryTypeId : null,
      "cibilScore": element.cibilScore ? element.cibilScore : null,
      "minIncome": element.minIncome ? element.minIncome : null,
      "vintage": element.vintage ? element.vintage : null,
      "minTurnOver": element.minTurnOver ? element.minTurnOver : null,
      "maxTurnOver": element.maxTurnOver ? element.maxTurnOver : null,
      "tenure": element.tenure ? element.tenure : null,
      "ROI": element.ROI ? element.ROI : null,
      "minLoanAmount": element.minLoanAmount ? element.minLoanAmount : null,
      "maxLoanAmount": element.maxLoanAmount ? element.maxLoanAmount : null,
      "itrRequired": element.itrRequired ? element.itrRequired : null
    });
  }

  public resetForm() {
    this.policyId = null;
    let bankId = this.bankPolicyForm.get("bankId").value;
    this.bankPolicyForm.reset();
    this.bankPolicyForm.get("bankId").setValue(bankId)
    this.bankLoanPolicy = null
  }

}
