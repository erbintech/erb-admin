import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Cities } from 'src/app/shared/models/cities';
import { Customer } from 'src/app/shared/models/customer';
import { Dsa } from 'src/app/shared/models/dsa';
import { Maritalstatuses } from 'src/app/shared/models/maritalstatuses';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { MaritalStautusesService } from 'src/app/shared/services/maritalstatus.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
declare let require;
const Swal = require('sweetalert2')
@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit {
  public token: string;
  public isAlert: boolean;
  public url: string;
  public picType: string;
  public alertMessage: string;
  public customers: Customer[] = new Array<Customer>();
  public customer: any = new Customer();
  public dsas: Dsa[] = new Array<Dsa>();
  public dsa = new Dsa();
  public cities: Cities[] = new Array<Cities>();
  public paramid: any;
  public alertType: string;
  public fetchRecord: number;
  public maritalStatuses: Maritalstatuses[] = new Array<Maritalstatuses>();
  public customerId: number

  public userPagePermission: UserPages[] = new Array<UserPages>();
  public isAdminVerificationRequired: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private dsaService: DsaService,
    private maritalStautusesService: MaritalStautusesService,
    public toggleMenuService: ToggleMenuService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this.userPagePermission.findIndex(c => c.name == 'customers');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isAdminVerificationRequired = (roleId == 1) ? true : this.userPagePermission[ind].deletePermission;
      }
    } else {
      let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
      this.isAdminVerificationRequired = (roleId == 1) ? true : false;
    }
  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    this.customerform.patchValue({ gender: 'Male' });
    await this.getMaritalStatuses();
    this.paramid = this.actRoute.snapshot.paramMap.get('id');
    let customerId = this.paramid;
    if (customerId) {
      this.customerId = customerId
      await this.getCustomerById();
    }
  }

  customerform = new FormGroup({
    "profilePicUrl": new FormControl(null),
    "fullName": new FormControl('', [Validators.required]),
    "contactNo": new FormControl(null, [Validators.required, Validators.minLength(10)]),
    "aadhaarCardNo": new FormControl(null, [Validators.required, Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')]),
    "panCardNo": new FormControl(null, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    "email": new FormControl('', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")),
    "birthDate": new FormControl('', Validators.required),
    "gender": new FormControl('', Validators.required),
    "maritalStatusId": new FormControl(null, Validators.required),
    "cibilScore": new FormControl(null),
    "label": new FormControl('', Validators.required),
    "pincode": new FormControl(null, Validators.required),
    "addressLine1": new FormControl('', Validators.required),
    "addressLine2": new FormControl(''),
    "cityId": new FormControl(null, Validators.required),
    "state": new FormControl('', Validators.required),
    "districtName": new FormControl('', Validators.required),
  })

  public async getCustomerById() {
    try {
      let res = await this.customerService.getCustomerById(this.customerId, this.token);
      if (res && res.status == 200) {
        this.customer = res.recordList;
        if (this.customer.pincode) {
          this.getCityByPincode(this.customer.pincode, false)
        }
        if (this.customer.profilePicUrl) {
          this.url = this.customer.profilePicUrl
        }
        this.customerform.setValue({
          "profilePicUrl": this.customer.profilePicUrl ? this.customer.profilePicUrl : null,
          "fullName": this.customer.fullName,
          "contactNo": this.customer.contactNo,
          "aadhaarCardNo": this.customer.aadhaarCardNo ? this.customer.aadhaarCardNo.replace(/\s/g, "") : null,
          "panCardNo": this.customer.panCardNo ? this.customer.panCardNo : null,
          "email": this.customer.email ? this.customer.email : null,
          "birthDate": this.customer.birthdate ? this.formatDate(new Date(this.customer.birthdate)) : null,
          "gender": this.customer.gender ? this.customer.gender : "Male",
          "cibilScore": this.customer.cibilScore ? this.customer.cibilScore : null,
          "maritalStatusId": this.customer.maritalStatusId ? this.customer.maritalStatusId : null,
          "label": this.customer.label ? this.customer.label : null,
          "pincode": this.customer.pincode ? this.customer.pincode : null,
          "addressLine1": this.customer.addressLine1 ? this.customer.addressLine1 : null,
          "addressLine2": this.customer.addressLine2 ? this.customer.addressLine2 : null,
          "cityId": this.customer.cityId ? this.customer.cityId : null,
          "state": this.customer.state ? this.customer.state : null,
          "districtName": this.customer.district ? this.customer.district : null,
        })
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

  public async insertCustomer(form) {
    if (form.valid) {
      try {
        if (this.customerform.get("contactNo").value) {
          let exist = await this.checkContactNoExist();
          if (exist) {
            this.toastrService.warning("Contact No Already Exist")
          }
          else {
            try {
              let userId = this.customer.userId ? this.customer.userId : null;
              let customerId = this.customer.id ? this.customer.id : null;
              let customerAddressId = this.customer.customerAddressId ? this.customer.customerAddressId : null;
              this.customer = this.customerform.value;
              this.customer.email = this.customer.email ? this.customer.email : null;
              this.customer.cibilScore = this.customer.cibilScore ? this.customer.cibilScore : null;
              if (this.customer.profilePicUrl) {
                if (!this.customer.profilePicUrl.includes("https")) {
                  this.customer.profilePicUrl = this.customer.profilePicUrl.split(",")[1];
                }
              }
              this.customer.profilePicUrl = this.customer.profilePicUrl ? this.customer.profilePicUrl : null
              this.customer.addressLine2 = this.customerform.get("addressLine2").value ? this.customerform.get("addressLine2").value : null;
              this.customer.city = this.cities.find(c => c.id == this.customer.cityId).name;
              this.customer.userId = userId
              this.customer.id = customerId;
              this.customer.customerAddressId = customerAddressId;
              let res = await this.customerService.insertCustomer(this.customer, this.token);
              if (res && res.status == 200) {
                Swal.fire(
                  'Successfully Insert Customer',
                  'success'
                )
                const modalContent = document.querySelector('.swal2-container');
                sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                this.router.navigate(['/customers'])

              }
              //}

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

  public async checkContactNoExist() {
    if (this.customerform.get("contactNo").value) {
      try {
        let exist = false
        let userId = this.customer.userId ? this.customer.userId : null
        let res = await this.customerService.checkContactNoExist(this.customerform.get("contactNo").value, 2, userId, this.token);
        if (res && res.status == 200) {
          exist = true;
          return exist;
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
      }
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
        if (this.cities && this.cities.length > 0) {
          if (isChangeCity)
            this.customerform.get("cityId").setValue(this.cities[0].id)
          this.customerform.get("districtName").setValue(this.cities[0].districtName)
          this.customerform.get("state").setValue(this.cities[0].stateName)
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

  public async selectedImage(e: any) {
    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        let photoType = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".") + 1);
        this.picType = photoType;
        this.url = image;
        this.customerform.patchValue({
          profilePicUrl: reader.result
        });
      }
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

  public removeImage() {
    this.url = null;
    this.customerform.get("profilePicUrl").reset();
  }

  public cancelUser() {
    this.router.navigateByUrl('/customers');
  }

}