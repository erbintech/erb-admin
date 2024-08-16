import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Leads } from 'src/app/shared/models/leads';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
import { LeadService } from 'src/app/shared/services/lead.service';

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.scss']
})
export class AddLeadComponent implements OnInit {
  public leadForm: FormGroup;
  public token: string;
  public cities = [];
  public alertMessage: string
  public employmentTypes = [];
  public lead = new Leads();
  public leadId: number;
  public services = [];

  constructor(
    private formBuilder: FormBuilder,
    private leadService: LeadService,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private employmentTypeService: EmploymentTypeService,
    private router: Router,
    private dsaService: DsaService,
    private route: ActivatedRoute
  ) {
    this.leadForm = this.formBuilder.group({
      "customerFullName": [null, [Validators.required]],
      "contactNo": [null, [Validators.required, Validators.minLength(10)]],
      "email": [null, [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")]],
      "employmentTypeId": [null, [Validators.required]],
      "serviceId": [null, [Validators.required]],
      "loanAmount": [null, [Validators.required]],
      "aadhaarCardNo": [null, [Validators.required, Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')]],
      "panCardNo": [null, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      "label": [null],
      "addressLine1": [null, [Validators.required]],
      "addressLine2": [null],
      "pincode": [null, [Validators.required, Validators.minLength(6)]],
      "cityId": [null, [Validators.required]],
      "district": [null, [Validators.required]],
      "state": [null, [Validators.required]]
    })
  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    this.route.params.subscribe(async (params) => {
      this.leadId = params['id'];
    });
    if (this.leadId) {
      this.getLeads();
    }

    await this.getEmploymentTypes();
    await this.getServices();
  }


  public async getLeads() {
    try {
      this.spinnerService.show();
      let res = await this.leadService.getLeads(null, null, this.token, null, null, this.leadId);
      if (res && res.status == 200) {
        this.lead = res.recordList[0];
        if (this.lead.pincode)
          this.getCityByPincode(this.lead.pincode, false)
        this.leadForm.setValue({
          "customerFullName": this.lead.customerFullName,
          "contactNo": this.lead.contactNo,
          "email": this.lead.email,
          "employmentTypeId": this.lead.employmentTypeId,
          "serviceId": this.lead.serviceId,
          "loanAmount": this.lead.loanAmount,
          "aadhaarCardNo": this.lead.aadhaarCardNo.replace(/\s/g, ""),
          "panCardNo": this.lead.panCardNo,
          "label": this.lead.label,
          "pincode": this.lead.pincode,
          "cityId": this.lead.cityId,
          "district": this.lead.district,
          "state": this.lead.state,
          "addressLine1": this.lead.addressLine1,
          "addressLine2": this.lead.addressLine2,
        })
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

  public async insertLead(form) {
    if (form.valid) {
      try {
        this.spinnerService.show();
        if (this.leadId) {
          let customerId = this.lead.customerId
          let customerAddressId = this.lead.customerAddressId;
          this.lead = this.leadForm.value;
          this.lead.customerId = customerId;
          this.lead.customerAddressId = customerAddressId
          this.lead.leadId = this.leadId;
          this.lead.addressLine2 = this.lead.addressLine2 ? this.lead.addressLine2 : null;
          this.lead.label = this.lead.label ? this.lead.label : null; 

          let res = await this.leadService.insertLead(this.lead, this.token);
          if (res && res.status == 200) {
            this.spinnerService.hide();
            this.router.navigate(["leads"]);
            this.toastrService.success("Lead Updated Successfully");
          }
        }
        else {
          this.lead = this.leadForm.value;
          this.lead.addressLine2 = this.lead.addressLine2 ? this.lead.addressLine2 : null;
          let res = await this.leadService.insertLead(this.lead, this.token);
          if (res && res.status == 200) {
            this.spinnerService.hide();
            this.router.navigate(["leads"]);
            this.toastrService.success("Lead Generated Successfully");
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
    else {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  public async onKeyUpEvent(event: any, isChangeCityId) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, isChangeCityId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getCityByPincode(n, isChangeCityId) {
    try {
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        this.cities = res.recordList;
        if (this.cities && this.cities.length > 0) {
          this.leadForm.get('district').setValue(this.cities[0].districtName);
          this.leadForm.get('state').setValue(this.cities[0].stateName);
          if (isChangeCityId)
            this.leadForm.get("cityId").setValue(this.cities[0].id)
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public async getEmploymentTypes() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getEmploymentType(this.token);
      if (res && res.status == 200) {
        this.employmentTypes = res.recordList;
        if (this.employmentTypes && this.employmentTypes.length > 0) {
          this.employmentTypes.forEach(ele => {
            if (ele.parentId) {
              let index = this.employmentTypes.findIndex(c => c.id == ele.parentId);
              ele.parentName = this.employmentTypes[index].name;
              this.employmentTypes[index].isParent = true;
            }
          });
        }
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

  public async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getServices(this.token);
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

  public cancelUser() {
    this.router.navigate(["leads"]);
  }

}
